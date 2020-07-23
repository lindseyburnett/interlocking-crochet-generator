import React from 'react';
import './App.scss';
import {Toolbar, TOOLBAR_DATA} from "./Toolbar";
import DrawingGrid from "./DrawingGrid";
import PatternDisplay from "./PatternDisplay";
import SettingsForm from "./SettingsForm";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

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

    this.state = {
      activeTool: defaultTool,
      mouseHeld: false,
      grid: rows,
      settings: {
        rows: initRows,
        cols: initCols,
        showDetailedView: false,
        showGrid: false,
        bgColor: "#FFFFFF",
        fgColor: "#B3B3B3"
      }
    };

    // initialize default styles
    this.updateToolStyles(TOOLBAR_DATA[defaultTool]);
    this.updateStyleVariable("--bg-color", this.state.settings.bgColor);
    this.updateStyleVariable("--fg-color", this.state.settings.fgColor);

    this.handleToolbarClick = this.handleToolbarClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
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

  handleToolbarClick(toolName) {
    this.setState({ activeTool: toolName });
    this.updateToolStyles(TOOLBAR_DATA[toolName]);
  }

  handleMouseDown() {
    this.setState({ mouseHeld: true });
  }

  handleMouseUp() {
    this.setState({ mouseHeld: false });
  }

  handlePencilAction(row, col) {
    this.setState((state, props) => {
      const newGrid = state.grid.slice();
      newGrid[row][col] = true;

      return { grid: newGrid };
    });
  }

  handleEraserAction(row, col) {
    this.setState((state, props) => {
      const newGrid = state.grid.slice();
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
        "fgColor": () => this.updateStyleVariable("--fg-color", settingValue)
      }[settingName];
      
      if(handlerFunc) {
        handlerFunc(settingValue);
      }
    });

    // once that's done, update everything in the state
    // this both handles things that don't need a handler function, and preserves the current values in the form
    this.setState({ settings: newValues });
  }

  updateRowsCount(newCount) {
    this.setState((state, props) => {
      let newGrid = state.grid.slice();
      
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
      let newGrid = state.grid.slice();

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
      >
        <Toolbar 
          activeTool={this.state.activeTool} 
          handleClick={this.handleToolbarClick}
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

// returns a new grid with dots set to true
// all other values are unchanged
// does not alter the original grid
function initializeDots(grid) {
  const newGrid = grid.slice();

  for(let i = 1; i < grid.length; i += 2) {
    for(let j = 1; j < grid[i].length; j+= 2) {
      newGrid[i][j] = true;
    }
  }

  return newGrid;
}