import React from "react";
import "./Toolbar.scss";
import ToolbarButton from "./ToolbarButton";
import pencilIcon from "../images/pencil.png";
import eraserIcon from "../images/eraser.png";
import newIcon from "../images/new.png";
import undoIcon from "../images/undo.png";
import redoIcon from "../images/redo.png";
import shiftUpIcon from "../images/shiftup.png";
import shiftDownIcon from "../images/shiftdown.png";
import shiftLeftIcon from "../images/shiftleft.png";
import shiftRightIcon from "../images/shiftright.png";

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
	const PASSIVE_TOOL_DATA = {
		New: {
			image: newIcon,
			isDisabled: false
		},
		Undo: {
			image: undoIcon,
			isDisabled: !props.canUndo
		},
		Redo: {
			image: redoIcon,
			isDisabled: !props.canRedo
		},
		ShiftUp: {
			image: shiftUpIcon,
			isDisabled: false
		},
		ShiftDown: {
			image: shiftDownIcon,
			isDisabled: false
		},
		ShiftLeft: {
			image: shiftLeftIcon,
			isDisabled: false
		},
		ShiftRight: {
			image: shiftRightIcon,
			isDisabled: false
		}
	};

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
		const tool = PASSIVE_TOOL_DATA[toolKey];
		return (
			<ToolbarButton
				key={toolKey}
				name={toolKey}
				image={tool.image}
				handleClick={props.handlePassiveClick}
				disabled={tool.isDisabled}
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