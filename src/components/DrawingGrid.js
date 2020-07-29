import React from "react";
import "./DrawingGrid.scss";
import DrawingGridSquare from "./DrawingGridSquare";
import {isSquareEdge} from "../utils/square-utils";
import LineTo from "react-lineto";

// TODO: use this to draw a line between the two points if the mouse is held: https://github.com/kdeloach/react-lineto

export default class DrawingGrid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lineStartX: 0,
			lineStartY: 0,
			lineEndX: 0,
			lineEndY: 0
		};

		this.renderRow = this.renderRow.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
	}

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

	handleMouseDown(e) {
		if(!this.props.lineToolActive) return;

		const rect = e.currentTarget.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		this.setState({
			lineStartX: mouseX,
			lineStartY: mouseY,
			lineEndX: mouseX,
			lineEndY: mouseY
		});
	}

	handleMouseMove(e) {
		if(!this.props.lineToolActive || !this.props.mouseHeld) return;

		const rect = e.currentTarget.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const rise = Math.abs(mouseY - this.state.lineStartY);
		const run = Math.abs(mouseX - this.state.lineStartX);
		const isVertical = rise > run;
		const endX = isVertical ? this.state.lineStartX : mouseX;
		const endY = isVertical ? mouseY : this.state.lineStartY;

		this.setState({
			lineEndX: endX,
			lineEndY: endY
		});
	}

	handleMouseUp() {
		if(!this.props.lineToolActive) return;

		const s = this.state;
		this.props.handleLineAction(s.lineStartX, s.lineStartY, s.lineEndX, s.lineEndY);

		this.setState({
			lineStartX: 0,
			lineStartY: 0,
			lineEndX: 0,
			lineEndY: 0
		});
	}

	render() {
		const contents = this.props.grid.map((row, rowNum) => (
			<div className="DrawingGrid__row" key={rowNum}>
				{this.renderRow(this.props.grid, rowNum)}
			</div>
		));

		const lineEnds = (
			<React.Fragment>
				<div className="DrawingGrid__line-cap  js-line-start" style={{top: this.state.lineStartY, left: this.state.lineStartX}} />
				<div className="DrawingGrid__line-cap  js-line-end" style={{top: this.state.lineEndY, left: this.state.lineEndX}} />
				<LineTo 
					from="js-line-start" to="js-line-end" 
					borderColor={document.documentElement.style.getPropertyValue("--fg-color")} 
					borderWidth={2}
				/>
			</React.Fragment>
		);

		return (
			<div 
				className={`DrawingGrid ${!this.props.showGrid ? "DrawingGrid--no-grid" : ""}`}
				onMouseDown={this.handleMouseDown}
				onMouseMove={this.handleMouseMove}
				onMouseUp={this.handleMouseUp}
			>
				{this.props.lineToolActive && lineEnds}
				{contents}
			</div>
		);
	}
}