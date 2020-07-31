import React from 'react';
import './App.scss';
import {Toolbar, TOOLBAR_DATA} from "./Toolbar";
import DrawingGrid from "./DrawingGrid";
import PatternDisplay from "./PatternDisplay";
import SettingsForm from "./SettingsForm";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { isSquareDot, isSquareLine, isSquareEdge, isSquareValid } from "../utils/square-utils";
import { HotKeys } from "react-hotkeys";

const SETTINGS_STYLE_VARIABLES = {
  bgColor: "--bg-color",
  fgColor: "--fg-color",
  squareSize: "--square-size"
};

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
        squareSize: 18,
        showRowNums: true,
        leftHandedMode: false
      }
    };

    // initialize default styles
    this.updateToolStyles(TOOLBAR_DATA[defaultTool]);
    this.updateBulkStyleVariables(this.state.settings);

    this.handleActiveToolbarClick = this.handleActiveToolbarClick.bind(this);
    this.handlePassiveToolbarClick = this.handlePassiveToolbarClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.updateHistoryIfNeeded = this.updateHistoryIfNeeded.bind(this);
    this.handleSquareInteract = this.handleSquareInteract.bind(this);
    this.handlePencilAction = this.handlePencilAction.bind(this);
    this.handleEraserAction = this.handleEraserAction.bind(this);
    this.handleFillAction = this.handleFillAction.bind(this);
    this.handleLineAction = this.handleLineAction.bind(this);
    this.handleSettingsSubmit = this.handleSettingsSubmit.bind(this);
    this.updateRowsCount = this.updateRowsCount.bind(this);
    this.updateColsCount = this.updateColsCount.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  }

  handleBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = true;
  }

  updateToolStyles(toolData) {
    const doc = document.documentElement;
    doc.style.setProperty("--tool-cursor", `url(${toolData.cursorImage})`);
    doc.style.setProperty("--tool-cursor-x", toolData.cursorX);
    doc.style.setProperty("--tool-cursor-y", toolData.cursorY);
  }

  handleActiveToolbarClick(toolName) {
    this.setState({ activeTool: toolName });
    this.updateToolStyles(TOOLBAR_DATA[toolName]);
  }

  handlePassiveToolbarClick(toolName) {
    if(toolName === "New") {
      if(window.confirm("Are you sure you want to clear the grid? (You'll be able to undo.)")) {
        this.setState((state, props) => {
          return { grid: initializeDots(state.grid, true) };
        });
      }
    } else if(toolName === "Undo") {
      this.setState((state, props) => {
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
      });
    } else if(toolName === "Redo") {
      this.setState((state, props) => {
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
      });
    } else if(toolName === "ShiftUp") {
      // shifts are lossy because behavior is inconsistent near the edges
      // if you have a "C" shape on the right edge, and shift right, the top and bottom bars will have to be lost
      // at least by losing everything that goes off the edge, it's intentional rather than looking buggy
      this.setState((state, props) => {
        const newGrid = deepClone(state.grid);
        newGrid.splice(1, 2);
        const dotsRow = Array(state.settings.cols).fill(false);
        for(let i = 1; i < dotsRow.length; i += 2) { dotsRow[i] = true; }
        newGrid.splice(newGrid.length-1, 0, Array(state.settings.cols).fill(false), dotsRow);
        return { grid: newGrid };
      });
    } else if(toolName === "ShiftDown") {
      this.setState((state, props) => {
        const newGrid = deepClone(state.grid);
        newGrid.splice(newGrid.length-3, 2);
        const dotsRow = Array(state.settings.cols).fill(false);
        for(let i = 1; i < dotsRow.length; i += 2) { dotsRow[i] = true; }
        newGrid.splice(1, 0, dotsRow, Array(state.settings.cols).fill(false));
        return { grid: newGrid };
      });
    } else if(toolName === "ShiftLeft") {
      this.setState((state, props) => {
        const newGrid = deepClone(state.grid);
        for(let i = 1; i < newGrid.length-1; i++) {
          const row = newGrid[i];
          row.splice(1, 2);
          row.splice(row.length-1, 0, false, i % 2 === 1);
        }
        return { grid: newGrid };
      });
    } else if(toolName === "ShiftRight") {
      this.setState((state, props) => {
        const newGrid = deepClone(state.grid);
        for(let i = 1; i < newGrid.length-1; i++) {
          const row = newGrid[i];
          row.splice(row.length-3, 2);
          row.splice(1, 0, i % 2 === 1, false);
        }
        return { grid: newGrid };
      });
    } else if(toolName === "Save") {
      let saveStr = "grid:";

      for(let i = 0; i < this.state.grid.length; i++) {
        for(let j = 0; j < this.state.grid[i].length; j++) {
          saveStr += this.state.grid[i][j] ? "1" : "0";
        }
        if(i !== this.state.grid[i].length-1) saveStr += ",";
      }

      Object.keys(this.state.settings).forEach(settingsKey => {
        saveStr += `\n${settingsKey}:${this.state.settings[settingsKey]}`;
      });

      const temp = document.createElement("a");
      const file = new Blob([saveStr], {type: "text/plain"});
      temp.href = URL.createObjectURL(file);
      temp.download = "icg_save.icg";
      document.body.appendChild(temp); // Firefox compat
      temp.click();
      temp.remove();
    } else if(toolName === "Load") {
      if(!window.confirm("Are you sure you want to load a new pattern? Any unsaved work will be lost.")) return;

      // create a temporary file input to hold the uploaded save data
      const temp = document.createElement("input");
      temp.type = "file";
      temp.style.display = "none";
      temp.setAttribute("accept", ".icg");

      // delete any inputs from before, like if the user clicked cancel
      const oldInput = document.querySelector("input[type='file'][accept='.icg']");
      if(oldInput) oldInput.remove();

      // add the temp input to the page and set up behavior
      document.body.appendChild(temp);
      temp.addEventListener("change", e => {
        const file = e.target.files[0];
        if(!file) return; // failsafe
        const reader = new FileReader();
        reader.onload = e => {
          this.setState((state, props) => {
            const loadedData = e.target.result;

            const dataEntries = {};
            let isInvalid = false;
            loadedData.split("\n").forEach(entry => {
              const entryParts = entry.split(":");
              if(entryParts.length !== 2) {
                isInvalid = true;
                return;
              }

              dataEntries[entryParts[0]] = entryParts[1];
            });

            if(isInvalid) {
              window.alert("Error: Save data is invalid (data is malformed).");
              return;
            }

            if(!dataEntries.grid || !dataEntries.rows || !dataEntries.cols) {
              window.alert("Error: Save data is invalid (missing grid info).");
              return;
            }

            const gridData = dataEntries.grid.split(",");
            const rows = parseInt(dataEntries.rows);
            const cols = parseInt(dataEntries.cols);

            // make sure the grid data has the right dimensions
            if(!rows || !cols || gridData.length !== rows || gridData[0].length !== cols) {
              window.alert("Error: Save data is invalid (grid info is malformed).");
              return;
            }

            // convert grid data into the form used by the app
            const grid = [];
            gridData.forEach(rowData => {
              const row = [];
              rowData.split("").forEach(squareData => {
                row.push(squareData === "1");
              });
              grid.push(row);
            });

            // convert settings data into the form used by the app
            const settings = deepClone(dataEntries);
            delete settings.grid;
            Object.keys(settings).forEach(settingsKey => {
              const settingsValue = settings[settingsKey];
              if(parseInt(settingsValue)) settings[settingsKey] = parseInt(settingsValue);
              if(settingsValue === "false") settings[settingsKey] = false;
              if(settingsValue === "true") settings[settingsKey] = true;
            });

            // fold in loaded settings
            // don't ensure all settings are present, so that settings updates don't immediately break saves from previous version
            const newSettings = Object.assign(deepClone(state.settings), settings);

            // done parsing, update the app!
            // (in theory we could just not wipe the history, but this makes more sense imo)
            this.updateBulkStyleVariables(settings);
            return { grid: grid, settings: newSettings, currentHistoryIndex: 0, history: [{
              grid: deepClone(grid),
              rows: settings.rows,
              cols: settings.cols
            }]};
          });
        }
        reader.readAsText(file);

        temp.remove();
      });

      // prompt the user for a file to get the ball rolling
      temp.click();
    } else if(toolName === "Random") {
      if(!window.confirm("Are you sure you want to randomize all squares? (You'll be able to undo.)")) return;
      this.setState((state, props) => {
        const newGrid = deepClone(state.grid);
        for(let i = 1; i < newGrid.length-1; i++) {
          for(let j = 1; j < newGrid[i].length-1; j++) {
            if(isSquareLine(i, j)) {
              newGrid[i][j] = Math.random() >= 0.5;
            }
          }
        }
        return { grid: newGrid };
      });
    }
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
        if(history.length > 20) history.shift();
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

  handleFillAction(row, col) {
    this.setState((state, props) => {
      // if they clicked an empty but invalid square, find the closest empty valid one (if one exists)
      if(!isSquareValid(row, col, state.grid) && !state.grid[row][col]) {
        if(isEmptyAndValid(row, col-1, state.grid)) col = col-1;
        else if(isEmptyAndValid(row-1, col, state.grid)) row = row-1;
        else if(isEmptyAndValid(row, col+1, state.grid)) col = col+1;
        else if(isEmptyAndValid(row+1, col, state.grid)) row = row+1;
        else return;
      }

      const newGrid = fillRecursively(row, col, deepClone(state.grid));
      return { grid: newGrid };
    });
  }

  // this is called from DrawingGrid, unlike the other active handlers
  handleLineAction(lineStartX, lineStartY, lineEndX, lineEndY) {
    this.setState((state, props) => {
      const squareSize = this.state.settings.squareSize;
      let startCol = Math.floor(lineStartX / squareSize);
      let startRow = Math.floor(lineStartY / squareSize);
      let endCol = Math.floor(lineEndX / squareSize);
      let endRow = Math.floor(lineEndY / squareSize);

      // swap the positions if the user drew bottom to top or right to left
      // this way we only have to worry about looping in one direction
      if(startCol > endCol) {
        let temp = startCol;
        startCol = endCol;
        endCol = temp;
      }
      if(startRow > endRow) {
        let temp = startRow;
        startRow = endRow;
        endRow = temp;
      }

      const newGrid = deepClone(this.state.grid);
      if(startCol === endCol) { // vertical line
        for(let i = startRow; i <= endRow; i++) {
          if(isSquareLine(i, startCol) && !isSquareEdge(i, startCol, newGrid)) {
            newGrid[i][startCol] = true;
          }
        }
      } else if(startRow === endRow) { // horizontal line
        for(let i = startCol; i <= endCol; i++) {
          if(isSquareLine(startRow, i) && !isSquareEdge(startRow, i, newGrid)) {
            newGrid[startRow][i] = true;
          }
        }
      }

      return { grid: newGrid };
    });
  }

  handleSquareInteract(row, col, isValid, allowFillValidityBypass=false) {
    // if Fill is active and allowFillValidityBypass is true, let it through
    if(!isValid && (!this.state.activeTool === "Fill" || !allowFillValidityBypass)) return;

    let actionFunc = {
      Pencil: this.handlePencilAction,
      Eraser: this.handleEraserAction,
      Fill: this.handleFillAction,
      Line: () => {} // noop; line requires special handling mostly called through DrawingGrid
    }[this.state.activeTool];

    actionFunc(row, col);
  }

  // workaround for touchmove only firing from originating element
  // pretty terrible but it'll do I guess
  handleTouchMove(e) {
    if(this.state.activeTool === "Line") return;
    const touchLoc = e.changedTouches[0];
    const targetEl = document.elementFromPoint(touchLoc.clientX, touchLoc.clientY);
    if(!targetEl.classList.contains("DrawingGridSquare")) return;
    const col = getIndexOfElementInParent(targetEl);
    const row = getIndexOfElementInParent(targetEl.parentElement);
    const isValid = !isSquareEdge(row, col, this.state.grid) && isSquareLine(row, col);
    this.handleSquareInteract(row, col, isValid);
  }

  handleSettingsSubmit(newValues) {

    // look for anything that has a handler function associated with it
    Object.keys(newValues).forEach(settingName => {
      const settingValue = newValues[settingName];
      const handlerFunc = {
        "rows": this.updateRowsCount,
        "cols": this.updateColsCount
      }[settingName];
      
      if(handlerFunc) {
        handlerFunc(settingValue);
      }
    });

    // update style variables as needed
    this.updateBulkStyleVariables(newValues);

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

  updateBulkStyleVariables(settings) {
    Object.keys(settings).forEach(settingsKey => {
      const styleVariable = SETTINGS_STYLE_VARIABLES[settingsKey];
      if(styleVariable) {
        const settingsValue = settingsKey === "squareSize" ? settings[settingsKey] + "px" : settings[settingsKey];
        this.updateStyleVariable(styleVariable, settingsValue);
      }
    })
  }

  render() {
    const hotkeysMap = {
      PENCIL: "q",
      ERASER: "w",
      LINE: "e",
      FILL: "r",
      NEW: "n",
      SAVE: "s",
      LOAD: "o",
      UNDO: ["ctrl+z", "z"],
      REDO: ["ctrl+y", "y"],
      SHIFT_UP: "i",
      SHIFT_LEFT: "j",
      SHIFT_DOWN: "k",
      SHIFT_RIGHT: "l",
      RANDOM: ";"
    };

    const hotkeysHandlers = {
      PENCIL: () => this.handleActiveToolbarClick("Pencil"),
      ERASER: () => this.handleActiveToolbarClick("Eraser"),
      LINE: () => this.handleActiveToolbarClick("Line"),
      NEW: () => this.handlePassiveToolbarClick("New"),
      SAVE: () => this.handlePassiveToolbarClick("Save"),
      LOAD: () => this.handlePassiveToolbarClick("Load"),
      UNDO: () => this.handlePassiveToolbarClick("Undo"),
      REDO: () => this.handlePassiveToolbarClick("Redo"),
      SHIFT_UP: () => this.handlePassiveToolbarClick("ShiftUp"),
      SHIFT_LEFT: () => this.handlePassiveToolbarClick("ShiftLeft"),
      SHIFT_DOWN: () => this.handlePassiveToolbarClick("ShiftDown"),
      SHIFT_RIGHT: () => this.handlePassiveToolbarClick("ShiftRight"),
      RANDOM: () => this.handlePassiveToolbarClick("Random")
    };

    return (
      <div 
        className="App"
        onMouseDown={this.handleMouseDown}
        onTouchStart={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onTouchEnd={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}
        onClick={this.updateHistoryIfNeeded}
        onTouchMove={this.handleTouchMove}
      >
        <HotKeys keyMap={hotkeysMap} handlers={hotkeysHandlers}>
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
                showRowNums={this.state.settings.showRowNums}
                handleSquareInteract={this.handleSquareInteract}
                mouseHeld={this.state.mouseHeld}
                lineToolActive={this.state.activeTool === "Line"}
                handleLineAction={this.handleLineAction}
                truncateRowNums={this.state.settings.squareSize < 15}
              />
            </div>
            <div className="App__col">
              <Tabs>
                <TabList>
                  <Tab>Pattern</Tab>
                  <Tab>Settings</Tab>
                </TabList>
                <TabPanel>
                  <PatternDisplay grid={this.state.grid} leftHandedMode={this.state.settings.leftHandedMode} />
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
        </HotKeys>
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

function getIndexOfElementInParent(el) {
  return Array.prototype.indexOf.call(el.parentElement.children, el);
}

const isEmptyAndValid = (row, col, grid) => {
  return !grid[row][col] && isSquareValid(row, col, grid);
};

function fillRecursively(row, col, grid) {
  if(!isEmptyAndValid(row, col, grid)) {
    return grid;
  } else {
    grid[row][col] = true;

    if(isEmptyAndValid(row-1, col-1, grid)) { // up-left
      grid = fillRecursively(row-1, col-1, grid);
    }

    if(isEmptyAndValid(row-1, col+1, grid)) { // up-right
      grid = fillRecursively(row-1, col+1, grid);
    }

    if(isEmptyAndValid(row+1, col+1, grid)) { // down-right
      grid = fillRecursively(row+1, col+1, grid);
    }

    if(isEmptyAndValid(row+1, col-1, grid)) { // down-left
      grid = fillRecursively(row+1, col-1, grid);
    }

    return grid;
  }
}