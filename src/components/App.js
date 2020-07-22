import React from 'react';
import './App.scss';
import PatternManager from "./PatternManager";
import {Toolbar, TOOLBAR_DATA} from "./Toolbar";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const defaultTool = "Pencil";

    this.state = {
      activeTool: defaultTool
    };
    this.updateToolStyles(TOOLBAR_DATA[defaultTool]);

    this.handleToolbarClick = this.handleToolbarClick.bind(this);
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

  render() {
    return (
      <div className="App">
        <Toolbar 
          activeTool={this.state.activeTool} 
          handleClick={this.handleToolbarClick}
        />
        <PatternManager 
          initRows={25} 
          initCols={25} 
          hasDetailedView={true}
          activeTool={this.state.activeTool}
        />
      </div>
    );
  }
}
