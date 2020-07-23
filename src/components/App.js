import React from 'react';
import './App.scss';
import PatternManager from "./PatternManager";
import {Toolbar, TOOLBAR_DATA} from "./Toolbar";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const defaultTool = "Pencil";

    this.state = {
      activeTool: defaultTool,
      mouseHeld: false
    };

    // initialize default cursor styles
    this.updateToolStyles(TOOLBAR_DATA[defaultTool]);

    this.handleToolbarClick = this.handleToolbarClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
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
        <PatternManager 
          activeTool={this.state.activeTool}
          mouseHeld={this.state.mouseHeld}
        />
      </div>
    );
  }
}
