import React from 'react';
import './App.scss';
import {Toolbar, TOOLBAR_DATA} from "./Toolbar";
import DrawingGrid from "./DrawingGrid";
import PatternDisplay from "./PatternDisplay";
import SettingsForm from "./SettingsForm";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { isSquareDot } from "../utils/square-utils";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const defaultTool = "Pencil";
    const initRows = 25;
    const initCols = 25;

    let rows = [];
    for(let i = 0; i < initRows; i++) {
      const newRow = Array(initCols).fill(false);
      rows.push(newRow);
    }

    rows = initializeDots(rows);

    // history is kept separate from current grid since drawing a line requires several updates to
    // grid state in a row, but we only want one entry in the history
    // (if you only drew one pixel at a time, grid could be replaced with the most recent history entry)
    this.state = {
      activeTool: defaultTool,
      mouseHeld: false,
      grid: rows,
      history: [{
        grid: deepClone(rows),
        rows: initRows,
        cols: initCols
      }],
      currentHistoryIndex: 0,
      settings: {
        rows: initRows,
        cols: initCols,
        showDetailedView: false,
        showGrid: false,
        bgColor: "#FFFFFF",
        fgColor: "#707070",
        squareSize: 18
      }
    };

    // initialize default styles
    this.updateToolStyles(TOOLBAR_DATA[defaultTool]);
    this.updateStyleVariable("--bg-color", this.state.settings.bgColor);
    this.updateStyleVariable("--fg-color", this.state.settings.fgColor);
    this.updateStyleVariable("--square-size", this.state.settings.squareSize + "px");

    this.handleActiveToolbarClick = this.handleActiveToolbarClick.bind(this);
    this.handlePassiveToolbarClick = this.handlePassiveToolbarClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.updateHistoryIfNeeded = this.updateHistoryIfNeeded.bind(this);
    this.handleSquareInteract = this.handleSquareInteract.bind(this);
    this.handlePencilAction = this.handlePencilAction.bind(this);
    this.handleEraserAction = this.handleEraserAction.bind(this);
    this.handleSettingsSubmit = this.handleSettingsSubmit.bind(this);
    this.updateRowsCount = this.updateRowsCount.bind(this);
    this.updateColsCount = this.updateColsCount.bind(this);
  }

  updateToolStyles(toolData) {
    const doc = document.documentElement;
    doc.style.setProperty("--tool-cursor", `url(${toolData.image})`);
    doc.style.setProperty("--tool-cursor-x", toolData.cursorX);
    doc.style.setProperty("--tool-cursor-y", toolData.cursorY);
  }

  handleActiveToolbarClick(toolName) {
    this.setState({ activeTool: toolName });
    this.updateToolStyles(TOOLBAR_DATA[toolName]);
  }

  handlePassiveToolbarClick(toolName) {
    this.setState((state, props) => {
      if(toolName === "New") {
        if(window.confirm("Are you sure?")) {
          return { grid: initializeDots(state.grid, true) };
        }
      } else if(toolName === "Undo") {
        const currentIndex = state.currentHistoryIndex;
        if(currentIndex === 0) return; // failsafe

        const prevHistory = state.history[currentIndex-1];
        const newSettings = deepClone(state.settings);
        newSettings.rows = prevHistory.rows;
        newSettings.cols = prevHistory.cols;
        return {
          grid: deepClone(prevHistory.grid),
          currentHistoryIndex: currentIndex - 1,
          settings: newSettings
        };
      } else if(toolName === "Redo") {
        const currentIndex = state.currentHistoryIndex;
        if(currentIndex === state.history.length-1) return; // failsafe

        const nextHistory = state.history[currentIndex+1];
        const newSettings = deepClone(state.settings);
        newSettings.rows = nextHistory.rows;
        newSettings.cols = nextHistory.cols;
        return {
          grid: deepClone(nextHistory.grid),
          currentHistoryIndex: currentIndex + 1,
          settings: newSettings
        };
      } else if(toolName === "ShiftUp") {
        // shifts are lossy because behavior is inconsistent near the edges
        // if you have a "C" shape on the right edge, and shift right, the top and bottom bars will have to be lost
        // at least by losing everything that goes off the edge, it's intentional rather than looking buggy
        const newGrid = deepClone(state.grid);
        newGrid.splice(1, 2);
        const dotsRow = Array(state.settings.cols).fill(false);
        for(let i = 1; i < dotsRow.length; i += 2) { dotsRow[i] = true; }
        newGrid.splice(newGrid.length-1, 0, Array(state.settings.cols).fill(false), dotsRow);
        return { grid: newGrid };
      } else if(toolName === "ShiftDown") {
        const newGrid = deepClone(state.grid);
        newGrid.splice(newGrid.length-3, 2);
        const dotsRow = Array(state.settings.cols).fill(false);
        for(let i = 1; i < dotsRow.length; i += 2) { dotsRow[i] = true; }
        newGrid.splice(1, 0, dotsRow, Array(state.settings.cols).fill(false));
        return { grid: newGrid };
      } else if(toolName === "ShiftLeft") {
        const newGrid = deepClone(state.grid);
        for(let i = 1; i < newGrid.length-2; i++) {
          const row = newGrid[i];
          row.splice(1, 2);
          row.splice(row.length-1, 0, false, i % 2 === 1);
        }
        return { grid: newGrid };
      } else if(toolName === "ShiftRight") {
        const newGrid = deepClone(state.grid);
        for(let i = 1; i < newGrid.length-2; i++) {
          const row = newGrid[i];
          row.splice(row.length-3, 2);
          row.splice(1, 0, i % 2 === 1, false);
        }
        return { grid: newGrid };
      }
    });
  }

  handleMouseDown() {
    this.setState({ mouseHeld: true });
  }

  handleMouseUp() {
    this.setState({ mouseHeld: false });
  }

  updateHistoryIfNeeded() {
    this.setState((state, props) => {
      const currentGrid = deepClone(state.grid);
      const history = deepClone(state.history).slice(0, state.currentHistoryIndex+1);
      const latestHistory = history[history.length-1].grid;

      if(JSON.stringify(currentGrid) === JSON.stringify(latestHistory)) {
        return {};
      } else {
        history.push({
          grid: currentGrid,
          rows: state.settings.rows,
          cols: state.settings.cols
        });
        if(history.length > 10) history.shift();
        return { 
          history: history,
          currentHistoryIndex: history.length-1
        };
      }      
    });
  }

  handlePencilAction(row, col) {
    this.setState((state, props) => {
      const newGrid = deepClone(state.grid);
      newGrid[row][col] = true;

      return { grid: newGrid };
    });
  }

  handleEraserAction(row, col) {
    this.setState((state, props) => {
      const newGrid = deepClone(state.grid);
      newGrid[row][col] = false;

      return { grid: newGrid };
    });
  }

  handleSquareInteract(row, col, isValid) {
    if(!isValid) return;

    let actionFunc = {
      Pencil: this.handlePencilAction,
      Eraser: this.handleEraserAction
    }[this.state.activeTool];

    actionFunc(row, col);
  }

  handleSettingsSubmit(newValues) {

    // look for anything that has a handler function associated with it
    Object.keys(newValues).forEach(settingName => {
      const settingValue = newValues[settingName];
      const handlerFunc = {
        "rows": this.updateRowsCount,
        "cols": this.updateColsCount,
        "bgColor": () => this.updateStyleVariable("--bg-color", settingValue),
        "fgColor": () => this.updateStyleVariable("--fg-color", settingValue),
        "squareSize": () => this.updateStyleVariable("--square-size", settingValue + "px")
      }[settingName];
      
      if(handlerFunc) {
        handlerFunc(settingValue);
      }
    });

    // once that's done, update everything in the state
    // this both handles things that don't need a handler function, and preserves the current values in the form
    this.setState({ settings: newValues }, this.updateHistoryIfNeeded);
  }

  updateRowsCount(newCount) {
    this.setState((state, props) => {
      let newGrid = deepClone(state.grid);
      
      let delta = newCount - newGrid.length;
      if(delta > 0) {
        while(delta-- > 0) { newGrid.push(Array(newGrid[0].length).fill(false)); }
        newGrid = initializeDots(newGrid);
      } else if(delta < 0) {
        newGrid.length = newCount;
        newGrid[newGrid.length-1].fill(false); // empty out bottom edge
      }

      return { grid: newGrid };
    });
  }

  updateColsCount(newCount) {
    this.setState((state, props) => {
      let newGrid = deepClone(state.grid);

      const delta = newCount - newGrid[0].length;
      if(delta > 0) {
        for(let i = 0; i < newGrid.length; i++) {
          const row = newGrid[i];
          let rowDelta = delta;
          while(rowDelta-- > 0) { row.push(false); }
        }

        newGrid = initializeDots(newGrid);
      } else if(delta < 0) {
        for(let i = 0; i < newGrid.length; i++) {
          const row = newGrid[i];
          row.length = newCount;
          row[row.length-1] = false; // empty out right edge
        }
      }

      return { grid: newGrid };
    });
  }

  updateStyleVariable(varName, newValue) {
    document.documentElement.style.setProperty(varName, newValue);
  }

  render() {
    return (
      <div 
        className="App"
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}
        onClick={this.updateHistoryIfNeeded}
      >
        <Toolbar 
          activeTool={this.state.activeTool} 
          handleActiveClick={this.handleActiveToolbarClick}
          handlePassiveClick={this.handlePassiveToolbarClick}
          canUndo={this.state.currentHistoryIndex > 0}
          canRedo={this.state.currentHistoryIndex < this.state.history.length - 1}
        />
        <div className="App__main">
          <div className="App__col">
            <DrawingGrid 
              grid={this.state.grid}
              showDetailedView={this.state.settings.showDetailedView}
              showGrid={this.state.settings.showGrid}
              handleSquareInteract={this.handleSquareInteract}
              mouseHeld={this.state.mouseHeld}
            />
          </div>
          <div className="App__col">
            <Tabs>
              <TabList>
                <Tab>Pattern</Tab>
                <Tab>Settings</Tab>
              </TabList>
              <TabPanel>
                <PatternDisplay />
              </TabPanel>
              <TabPanel>
                <SettingsForm
                  handleSubmit={this.handleSettingsSubmit}
                  settings={this.state.settings}
                />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

function deepClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

// returns a new grid with dots set to true
// does not alter the original grid
// if resetLines is true, will wipe everything else, basically resetting to a blank state
function initializeDots(grid, resetLines=false) {
  const newGrid = deepClone(grid);

  if(resetLines) {
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        newGrid[i][j] = isSquareDot(i, j);
      }
    }
  } else {
    for(let i = 1; i < grid.length; i += 2) {
      for(let j = 1; j < grid[i].length; j+= 2) {
        newGrid[i][j] = true;
      }
    }
  }

  return newGrid;
}