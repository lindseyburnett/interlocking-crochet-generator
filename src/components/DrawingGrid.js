import React from "react";
import "./DrawingGrid.scss";
import DrawingGridSquare from "./DrawingGridSquare";
import {isSquareEdge} from "../utils/square-utils";
import LineTo from "react-lineto";
import { getPatternRow } from "../utils/pattern-utils";

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
		const locData = e.touches ? e.touches[0] : e;

		const rect = e.currentTarget.getBoundingClientRect();
		const mouseX = locData.clientX - rect.left;
		const mouseY = locData.clientY - rect.top;

		this.setState({
			lineStartX: mouseX,
			lineStartY: mouseY,
			lineEndX: mouseX,
			lineEndY: mouseY
		});
	}

	handleMouseMove(e) {
		if(!this.props.lineToolActive || !this.props.mouseHeld) return;
		const locData = e.touches ? e.touches[0] : e;

		const rect = e.currentTarget.getBoundingClientRect();
		const mouseX = locData.clientX - rect.left;
		const mouseY = locData.clientY - rect.top;

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

		const rowNums = [];
		for(let i = getPatternRow(0, this.props.grid.length); i > 0; i--) {
			rowNums.push(<span key={i}>{i}</span>);
		}

		return (
			<React.Fragment>
				<div 
					className={`DrawingGrid ${!this.props.showGrid ? "DrawingGrid--no-grid" : ""} ${this.props.showRowNums ? "DrawingGrid--has-nums" : ""}`}
					onMouseDown={this.handleMouseDown}
					onTouchStart={this.handleMouseDown}
					onMouseMove={this.handleMouseMove}
					onTouchMove={this.handleMouseMove}
					onMouseUp={this.handleMouseUp}
					onTouchEnd={this.handleMouseUp}
					onMouseLeave={this.handleMouseLeave}
					onMouseEnter={this.handleMouseEnter}
				>
					{this.props.lineToolActive && lineEnds}
					{contents}
				</div>
				{this.props.showRowNums && <div className={`DrawingGrid__row-nums ${this.props.truncateRowNums ? "DrawingGrid__row-nums--truncated" : ""}`}>{rowNums}</div>}
				{this.props.showRowNums && <div className={`DrawingGrid__row-nums  DrawingGrid__row-nums--left ${this.props.truncateRowNums ? "DrawingGrid__row-nums--truncated" : ""}`}>{rowNums}</div>}
			</React.Fragment>
		);
	}
}