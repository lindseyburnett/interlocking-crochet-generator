import React from "react";
import DrawingGridSquare from "./DrawingGridSquare";
import LineToolIndicator from "./LineToolIndicator";
import DrawingGridRowNums from "./DrawingGridRowNums";

import { isSquareEdge } from "../utils/square-utils";
import { getPatternRow } from "../utils/pattern-utils";

import "./DrawingGrid.scss";

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

	// only used by Line tool, to set start position
	// note that doing this in the grid instead of the App auto-restrains clicks to inside the grid
	handleMouseDown(e) {
		if(!this.props.lineToolActive) return;
		const locData = e.touches ? e.touches[0] : e;

		// find pixel location of mouse relative to grid
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

	// only used by Line tool, to line up end position with mouse
	handleMouseMove(e) {
		if(!this.props.lineToolActive || !this.props.mouseHeld) return;
		const locData = e.touches ? e.touches[0] : e;

		// find pixel location of mouse relative to grid
		const rect = e.currentTarget.getBoundingClientRect();
		const mouseX = locData.clientX - rect.left;
		const mouseY = locData.clientY - rect.top;

		// really only needed on mobile, since mousemove events already only fire inside the grid
		// also helps with an occasional mouse bug where precise drawing lets you get a pixel outside
		if(mouseX < 0 || mouseY < 0 || mouseX > rect.width || mouseY > rect.height) return;

		// restrict the end of the line to a cardinal direction relative to the start
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

	// only used by the Line tool, to signal that the user has finished drawing the line
	// handleLineAction comes from the App
	handleMouseUp() {
		if(!this.props.lineToolActive) return;

		const s = this.state;
		this.props.handleLineAction(s.lineStartX, s.lineStartY, s.lineEndX, s.lineEndY);

		// reset position so there's not a phantom line in the grid
		this.setState({
			lineStartX: 0,
			lineStartY: 0,
			lineEndX: 0,
			lineEndY: 0
		});
	}

	// signals the user clicked in the grid, then moved the mouse outside with it still held down
	handleMouseLeave() {
		if(this.props.lineToolActive && this.props.mouseHeld) {
			this.setState({ heldMouseMovedOutside: true });
		}		
	}

	// works in combo with the above to get out of the glitchy state that edge case causes
	// we can't "hear" mouseups outside the grid, but mouseHeld comes from App so it's global
	// so if heldMouseMovedOutside is true and mouseHeld is false, the user did the above thing,
	// then let go of the button while outside the grid, and then moved back in
	// just force the line to draw from its last known location
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

		const rowNums = [];
		for(let i = getPatternRow(0, this.props.grid.length); i > 0; i--) {
			rowNums.push(i);
		}

		return (
			<div className="DrawingGrid__wrap">
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
					{this.props.lineToolActive && this.props.mouseHeld && <LineToolIndicator
						lineStartX={this.state.lineStartX}
						lineStartY={this.state.lineStartY}
						lineEndX={this.state.lineEndX}
						lineEndY={this.state.lineEndY}
					/>}
					{contents}
				</div>
				{this.props.showRowNums && <DrawingGridRowNums
					truncated={this.props.truncateRowNums}
					nums={rowNums}
				/>}
			</div>
		);
	}
}