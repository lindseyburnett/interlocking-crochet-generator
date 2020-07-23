import React from "react";
import "./DrawingGrid.scss";
import DrawingGridSquare from "./DrawingGridSquare";
import {isSquareEdge} from "../utils/square-utils";

export default class DrawingGrid extends React.Component {
	renderRow(grid, rowNum) {
		return grid[rowNum].map((isSquareFilled, colNum) => (
			<DrawingGridSquare
				key={colNum}
				row={rowNum}
				col={colNum}
				isEdge={isSquareEdge(rowNum, colNum, grid)}
				onInteract={this.props.handleSquareInteract}
				isFilled={isSquareFilled}
				isMouseHeld={this.props.mouseHeld}
				showDetailedView={this.props.showDetailedView}
			/>
		));
	}

	render() {
		const contents = this.props.grid.map((row, rowNum) => (
			<div className="DrawingGrid__row" key={rowNum}>
				{this.renderRow(this.props.grid, rowNum)}
			</div>
		));

		return (
			<div 
				className={`DrawingGrid ${!this.props.showGrid ? "DrawingGrid--no-grid" : ""}`}
			>
				{contents}
			</div>
		);
	}
}
