import React from "react";
import "./Toolbar.scss";
import ToolbarButton from "./ToolbarButton";
import pencilIcon from "../images/pencil.svg";
import eraserIcon from "../images/eraser.svg";
import newIcon from "../images/new.svg";
import undoIcon from "../images/undo.svg";
import redoIcon from "../images/redo.svg";
import shiftUpIcon from "../images/shiftup.svg";
import shiftDownIcon from "../images/shiftdown.svg";
import shiftLeftIcon from "../images/shiftleft.svg";
import shiftRightIcon from "../images/shiftright.svg";
import saveIcon from "../images/save.svg";
import loadIcon from "../images/load.svg";
import randomIcon from "../images/random.svg";
import lineIcon from "../images/line.svg";
import lineCursor from "../images/line-cursor.svg";
import fillIcon from "../images/fill.svg";

// active tool data is exported so we can access cursor info elsewhere
export const TOOLBAR_DATA = {
	Pencil: {
		image: pencilIcon,
		cursorImage: pencilIcon,
		cursorX: 0,
		cursorY: 24,
		tooltip: "Pencil Tool (Q)"
	},
	Eraser: {
		image: eraserIcon,
		cursorImage: eraserIcon,
		cursorX: 0,
		cursorY: 22,
		tooltip: "Eraser Tool (W)"
	},
	Line: {
		image: lineIcon,
		cursorImage: lineCursor,
		cursorX: 0,
		cursorY: 24,
		tooltip: "Line Tool (E)"
	},
	Fill: {
		image: fillIcon,
		cursorImage: fillIcon,
		cursorX: 24,
		cursorY: 20,
		tooltip: "Fill Tool (R)"
	}
};

export function Toolbar(props) {
	const PASSIVE_TOOL_DATA = [
		{
			New: {
				image: newIcon,
				isDisabled: false,
				tooltip: "New Pattern (N)"
			},
			Save: {
				image: saveIcon,
				isDisabled: false,
				tooltip: "Save Pattern (S)"
			},
			Load: {
				image: loadIcon,
				isDisabled: false,
				tooltip: "Load Pattern (O)"
			}
		},
		{
			Undo: {
				image: undoIcon,
				isDisabled: !props.canUndo,
				tooltip: "Undo (Z/ctrl+z)"
			},
			Redo: {
				image: redoIcon,
				isDisabled: !props.canRedo,
				tooltip: "Redo (Y/ctrl+y)"
			}
		},
		{
			ShiftUp: {
				image: shiftUpIcon,
				isDisabled: false,
				tooltip: "Shift Up (I)"
			},
			ShiftDown: {
				image: shiftDownIcon,
				isDisabled: false,
				tooltip: "Shift Down (K)"
			},
			ShiftLeft: {
				image: shiftLeftIcon,
				isDisabled: false,
				tooltip: "Shift Left (J)"
			},
			ShiftRight: {
				image: shiftRightIcon,
				isDisabled: false,
				tooltip: "Shift Right (L)"
			}
		},
		{
			Random: {
				image: randomIcon,
				isDisabled: false,
				tooltip: "Random Pattern (;)"
			}
		}
	];

	const activeButtons = Object.keys(TOOLBAR_DATA).map(toolKey => {
		const tool = TOOLBAR_DATA[toolKey];
		return (
			<ToolbarButton
				key={toolKey}
				name={toolKey}
				image={tool.image}
				isActive={toolKey === props.activeTool}
				handleClick={props.handleActiveClick}
				tooltip={tool.tooltip}
			/>
		);
	});

	const passiveGroups = [];
	PASSIVE_TOOL_DATA.forEach((group, i) => {
		const buttons = Object.keys(group).map(toolKey => {
			const tool = group[toolKey];
			return (
				<ToolbarButton
					key={toolKey}
					name={toolKey}
					image={tool.image}
					handleClick={props.handlePassiveClick}
					disabled={tool.isDisabled}
					tooltip={tool.tooltip}
				/>
			);
		});

		passiveGroups.push(<div className="Toolbar__section" key={i}>{buttons}</div>);
	});

	return (
		<div className="Toolbar">
			<div className="Toolbar__section">{activeButtons}</div>
			{passiveGroups}
		</div>
	);
}