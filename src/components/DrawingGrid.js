import React from "react";
import "./DrawingGrid.scss";
import DrawingGridSquare from "./DrawingGridSquare";
import {isSquareEdge} from "../utils/square-utils";
// import LineTo from "react-lineto";

export default class DrawingGrid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lineStartX: 0,
			lineStartY: 0,
			lineEndX: 0,
			lineEndY: 0,
			heldMouseMovedOutside: false
		};

		this.renderRow = this.renderRow.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
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

	handleMouseLeave() {
		if(!this.props.lineToolActive || !this.props.mouseHeld) return;
		this.setState({ heldMouseMovedOutside: true });
	}

	handleMouseEnter() {
		if(!this.props.lineToolActive) return;
		if(this.state.heldMouseMovedOutside && !this.props.mouseHeld) {
			this.handleMouseUp();
			this.setState({ heldMouseMovedOutside: false });
		}
	}

	render() {
		const contents = this.props.grid.map((row, rowNum) => (
			<div className="DrawingGrid__row" key={rowNum}>
				{this.renderRow(this.props.grid, rowNum)}
			</div>
		));

		const isWidthNegative = Math.sign(this.state.lineEndX - this.state.lineStartX) === -1;
		const isHeightNegative = Math.sign(this.state.lineEndY - this.state.lineStartY) === -1;
		const absWidth = Math.abs(this.state.lineEndX - this.state.lineStartX) + 2;
		const absHeight = Math.abs(this.state.lineEndY - this.state.lineStartY) + 2
		const showLine = absWidth !== 2 || absHeight !== 2;

		const line = (
			<div 
				className="DrawingGrid__line" 
				style={{
					top: this.state.lineStartY - (isHeightNegative ? absHeight: 0), 
					left: this.state.lineStartX - (isWidthNegative ? absWidth : 0), 
					width: Math.abs(this.state.lineEndX - this.state.lineStartX) + 2,
					height: Math.abs(this.state.lineEndY - this.state.lineStartY) + 2
				}} 
			/>
		);

		return (
			<div 
				className={`DrawingGrid ${!this.props.showGrid ? "DrawingGrid--no-grid" : ""}`}
				onMouseDown={this.handleMouseDown}
				onMouseMove={this.handleMouseMove}
				onMouseUp={this.handleMouseUp}
				onMouseLeave={this.handleMouseLeave}
				onMouseEnter={this.handleMouseEnter}
			>
				{this.props.lineToolActive && showLine && line}
				{contents}
			</div>
		);
	}
}