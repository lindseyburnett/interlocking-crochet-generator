import React from "react";
import "./Toolbar.scss";
import ToolbarButton from "./ToolbarButton";
import pencilIcon from "../images/pencil.png";
import eraserIcon from "../images/eraser.png";

export const TOOLBAR_DATA = {
	Pencil: {
		image: pencilIcon,
		cursorX: 0,
		cursorY: 22
	},
	Eraser: {
		image: eraserIcon,
		cursorX: 0,
		cursorY: 24
	}
};

export function Toolbar(props) {
	const buttons = Object.keys(TOOLBAR_DATA).map(toolKey => {
		const tool = TOOLBAR_DATA[toolKey];
		return (
			<ToolbarButton
				key={toolKey}
				name={toolKey}
				image={tool.image}
				isActive={toolKey === props.activeTool}
				handleClick={props.handleClick}
			/>
		);
	});

	return (
		<div className="Toolbar">
			{buttons}
		</div>
	);
}