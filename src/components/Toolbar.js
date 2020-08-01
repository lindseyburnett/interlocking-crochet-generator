import React from "react";
import ToolbarButton from "./ToolbarButton";
import { ACTIVE_TOOL_DATA, PASSIVE_TOOL_DATA } from "../constants";
import "./Toolbar.scss";

export function Toolbar(props) {
	const activeButtons = Object.keys(ACTIVE_TOOL_DATA).map(toolKey => {
		const tool = ACTIVE_TOOL_DATA[toolKey];
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
					disabled={(toolKey === "Undo" && !props.canUndo) || (toolKey === "Redo" && !props.canRedo)}
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