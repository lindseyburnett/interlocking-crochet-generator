import React from "react";
import "./DrawingGridSquare.scss";
import {
	isSquareDot, 
	isSquareLine, 
	getSquareLineDirection
} from "../utils/square-utils";

export default function DrawingGridSquare(props) {
	const isDot = isSquareDot(props.row, props.col);
	const isLine = isSquareLine(props.row, props.col);
	const isValid = !props.isEdge && isLine;

	// TODO: change to use SVGs instead so they scale with the square size
	let contents = "";
	if(!props.isEdge && props.showDetailedView) {
		if(isDot) {
			contents = "•";
		} else if(isLine) {
			const lineDirection = getSquareLineDirection(props.row, props.col);
			contents = lineDirection === "horiz" ? "—" : "|";
		}
	}

	let dynamicClasses = "";
	dynamicClasses += isValid && props.showDetailedView ? "DrawingGridSquare--valid " : "";
	dynamicClasses += props.isFilled ? "DrawingGridSquare--filled " : "";

	return (
		<div 
			className={`DrawingGridSquare ${dynamicClasses}`} 
			onClick={() => props.onInteract(props.row, props.col, isValid)}
			onMouseMove={() => props.onInteract(props.row, props.col, isValid && props.isMouseHeld)}
		>
			{!!contents && <span>{contents}</span>}
		</div>
	);
}
