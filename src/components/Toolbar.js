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
import saveIcon from "../images/save.png";
import loadIcon from "../images/load.png";
import randomIcon from "../images/random.png";

// active tool data is exported so we can access cursor info elsewhere
export const TOOLBAR_DATA = {
	Pencil: {
		image: pencilIcon,
		cursorX: 0,
		cursorY: 22,
		tooltip: "Pencil Tool (Q)"
	},
	Eraser: {
		image: eraserIcon,
		cursorX: 0,
		cursorY: 24,
		tooltip: "Eraser Tool (W)"
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
				tooltip: "Random Pattern (R)"
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