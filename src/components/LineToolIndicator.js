import React from "react";
import LineTo from "react-lineto";
import "./LineToolIndicator.scss";

export default function LineToolIndicator(props) {
	return (
		<div className="LineToolIndicator">
			<div 
				className="LineToolIndicator__cap  js-line-start" 
				style={{top: props.lineStartY, left: props.lineStartX}}
			/>
			<div
				className="LineToolIndicator__cap  js-line-end"
				style={{top: props.lineEndY, left: props.lineEndX}}
			/>
			<LineTo 
				from="js-line-start" to="js-line-end" 
				borderColor={document.documentElement.style.getPropertyValue("--fg-color")} 
				borderWidth={2}
				className="LineToolIndicator__line"
			/>
		</div>
	);
}