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
		this.updateColsCount = this.updateColsCount.bind(this);
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
				"rows": this.updateRowsCount,
				"cols": this.updateColsCount
			}[settingName];
			
			if(handlerFunc) {
				handlerFunc(settingValue);
			} else {
				console.warn("Handler not found for setting name:", settingName);
			}
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
				newGrid[newGrid.length-1].fill(false); // empty out bottom edge
			}

			return { grid: newGrid };
		});
	}

	updateColsCount(newCount) {
		this.setState((state, props) => {
			let newGrid = state.grid.slice();

			const delta = newCount - newGrid[0].length;
			if(delta > 0) {
				for(let i = 0; i < newGrid.length; i++) {
					const row = newGrid[i];
					let rowDelta = delta;
					while(rowDelta-- > 0) { row.push(false); }
				}

				newGrid = initializeDots(newGrid);
			} else if(delta < 0) {
				for(let i = 0; i < newGrid.length; i++) {
					const row = newGrid[i];
					row.length = newCount;
					row[row.length-1] = false; // empty out right edge
				}
			}

			return { grid: newGrid };
		});
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
								initRows={this.props.initRows}
								initCols={this.props.initCols}
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