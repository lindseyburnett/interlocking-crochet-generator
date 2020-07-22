import React from "react";
import "./DrawingGrid.scss";
import DrawingGridSquare from "./DrawingGridSquare";
import {isSquareEdge} from "../utils/square-utils";

export default class DrawingGrid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mouseHeld: false
		};

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
	}

	renderRow(grid, rowNum) {
		return grid[rowNum].map((isSquareFilled, colNum) => (
			<DrawingGridSquare
				key={colNum}
				hasDetailedView={this.props.hasDetailedView}
				row={rowNum}
				col={colNum}
				isEdge={isSquareEdge(rowNum, colNum, grid)}
				onInteract={this.props.handleSquareInteract}
				isFilled={isSquareFilled}
				isMouseHeld={this.state.mouseHeld}
			/>
		));
	}

	handleMouseDown() {
		this.setState({ mouseHeld: true });
	}

	handleMouseUp() {
		this.setState({ mouseHeld: false });
	}

	render() {
		const contents = this.props.grid.map((row, rowNum) => (
			<div className="DrawingGrid__row" key={rowNum}>
				{this.renderRow(this.props.grid, rowNum)}
			</div>
		));

		return (
			<div 
				className="DrawingGrid"
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
			>
				{contents}
			</div>
		);
	}
}
