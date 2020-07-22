import React from "react";
import "./ToolbarButton.scss";

export default function ToolbarButton(props) {
	return (
		<div 
			className={`ToolbarButton ${props.isActive? "ToolbarButton--active" : ""}`}
			onClick={() => props.handleClick(props.name)}
		>
			<img src={props.image} alt={props.name} />
		</div>
	);
}