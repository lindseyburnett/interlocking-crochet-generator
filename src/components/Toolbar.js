import React from "react";
import "./Toolbar.scss";
import ToolbarButton from "./ToolbarButton";
import pencilIcon from "../images/pencil.png";
import eraserIcon from "../images/eraser.png";
import newIcon from "../images/new.png";

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

const PASSIVE_TOOL_DATA = {
	New: newIcon
};

export function Toolbar(props) {
	const activeButtons = Object.keys(TOOLBAR_DATA).map(toolKey => {
		const tool = TOOLBAR_DATA[toolKey];
		return (
			<ToolbarButton
				key={toolKey}
				name={toolKey}
				image={tool.image}
				isActive={toolKey === props.activeTool}
				handleClick={props.handleActiveClick}
			/>
		);
	});

	const passiveButtons = Object.keys(PASSIVE_TOOL_DATA).map(toolKey => {
		const toolImage = PASSIVE_TOOL_DATA[toolKey];
		return (
			<ToolbarButton
				key={toolKey}
				name={toolKey}
				image={toolImage}
				handleClick={props.handlePassiveClick}
			/>
		);
	});

	return (
		<div className="Toolbar">
			<div className="Toolbar__section">{activeButtons}</div>
			<div className="Toolbar__section">{passiveButtons}</div>
		</div>
	);
}