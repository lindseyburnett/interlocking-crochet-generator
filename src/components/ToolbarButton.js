import React from "react";
import "./ToolbarButton.scss";

export default function ToolbarButton(props) {
	return (
		<div 
			className={`ToolbarButton ${props.isActive? "ToolbarButton--active" : ""}`}
			onClick={() => !props.disabled && props.handleClick(props.name)}
			disabled={props.disabled}
			title={props.tooltip}
		>
			<img src={props.image} alt={props.name} />
		</div>
	);
}