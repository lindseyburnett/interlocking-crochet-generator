import React from "react";
import "./PatternManager.scss";
import DrawingGrid from "./DrawingGrid";
import PatternDisplay from "./PatternDisplay";
import SettingsForm from "./SettingsForm";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export default class PatternManager extends React.Component {
	constructor(props) {
		super(props);

		let rows = [];
		for(let i = 0; i < props.initRows; i++) {
			const newRow = Array(props.initCols).fill(false);
			rows.push(newRow);
		}

		rows = initializeDots(rows);
		this.state = {
			grid: rows
		};

		this.handleSquareInteract = this.handleSquareInteract.bind(this);
		this.handlePencilAction = this.handlePencilAction.bind(this);
		this.handleEraserAction = this.handleEraserAction.bind(this);
		this.handleSettingsSubmit = this.handleSettingsSubmit.bind(this);
		this.updateRowsCount = this.updateRowsCount.bind(this);
	}

	handlePencilAction(row, col) {
		this.setState((state, props) => {
			const newGrid = state.grid.slice();
			newGrid[row][col] = true;

			return { grid: newGrid };
		});
	}

	handleEraserAction(row, col) {
		this.setState((state, props) => {
			const newGrid = state.grid.slice();
			newGrid[row][col] = false;

			return { grid: newGrid };
		});
	}

	handleSquareInteract(row, col, isValid) {
		if(!isValid) return;

		let actionFunc = {
			Pencil: this.handlePencilAction,
			Eraser: this.handleEraserAction
		}[this.props.activeTool];

		actionFunc(row, col);
	}

	handleSettingsSubmit(newValues) {
		Object.keys(newValues).forEach(settingName => {
			const settingValue = newValues[settingName];
			const handlerFunc = {
				"rows": this.updateRowsCount
			}[settingName];
			handlerFunc(settingValue);
		});
	}

	updateRowsCount(newCount) {
		this.setState((state, props) => {
			let newGrid = state.grid.slice();
			
			let delta = newCount - newGrid.length;
			if(delta > 0) {
				while(delta-- > 0) { newGrid.push(Array(newGrid[0].length).fill(false)); }
				newGrid = initializeDots(newGrid);
			} else if(delta < 0) {
				newGrid.length = newCount;
			}

			return { grid: newGrid };
		});
	}

	updateColsCount(newCount) {
		// TODO
	}

	render() {
		return (
			<div className="PatternManager">
				<div className="PatternManager__col">
					<DrawingGrid 
						grid={this.state.grid}
						hasDetailedView={this.props.hasDetailedView}
						handleSquareInteract={this.handleSquareInteract}
					/>
				</div>
				<div className="PatternManager__col">
					<Tabs>
						<TabList>
							<Tab>Pattern</Tab>
							<Tab>Settings</Tab>
						</TabList>
						<TabPanel>
							<PatternDisplay />
						</TabPanel>
						<TabPanel>
							<SettingsForm
								handleSubmit={this.handleSettingsSubmit}
							/>
						</TabPanel>
					</Tabs>
					</div>
			</div>
		);
	}
}

// returns a new grid with dots set to true
// all other values are unchanged
// does not alter the original grid
function initializeDots(grid) {
	const newGrid = grid.slice();

	for(let i = 1; i < grid.length; i += 2) {
		for(let j = 1; j < grid[i].length; j+= 2) {
			newGrid[i][j] = true;
		}
	}

	return newGrid;
}