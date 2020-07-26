import React from "react";
import "./DrawingGridSquare.scss";
import {
	isSquareDot, 
	isSquareLine, 
	getSquareLineDirection
} from "../utils/square-utils";

const dot = (
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
	  <circle cx="50" cy="50" r="50"/>
	</svg>
);

const vertLine = <div className="DrawingGridSquare__vert-line"></div>;
const horizLine = <div className="DrawingGridSquare__horiz-line"></div>;

export default function DrawingGridSquare(props) {
	const isDot = isSquareDot(props.row, props.col);
	const isLine = isSquareLine(props.row, props.col);
	const isValid = !props.isEdge && isLine;

	let contents = "";
	if(!props.isEdge && props.showDetailedView) {
		if(isDot) {
			contents = dot;
		} else if(isLine) {
			const lineDirection = getSquareLineDirection(props.row, props.col);
			contents = lineDirection === "horiz" ? horizLine : vertLine;
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
			{!!contents && contents}
		</div>
	);
}
