import pencilIcon from "./images/pencil.svg";
import eraserIcon from "./images/eraser.svg";
import newIcon from "./images/new.svg";
import undoIcon from "./images/undo.svg";
import redoIcon from "./images/redo.svg";
import shiftUpIcon from "./images/shiftup.svg";
import shiftDownIcon from "./images/shiftdown.svg";
import shiftLeftIcon from "./images/shiftleft.svg";
import shiftRightIcon from "./images/shiftright.svg";
import saveIcon from "./images/save.svg";
import loadIcon from "./images/load.svg";
import randomIcon from "./images/random.svg";
import lineIcon from "./images/line.svg";
import lineCursor from "./images/line-cursor.svg";
import fillIcon from "./images/fill.svg";
import printIcon from "./images/print.svg";
import aboutIcon from "./images/about.svg";
import generateLinkIcon from "./images/generate-link.svg";

import AboutModal from "./components/AboutModal";
import ShareModal from "./components/ShareModal";

/*
	each top-layer object is converted to a separate row in the settings form

	when adding a new setting, don't forget to also update INIT_SETTINGS
	if you only need it to show up in the state, just need to implement the effects of that
	if it just needs a CSS variable, add it to SETTINGS_STYLE_VARIABLES and you're done
	otherwise, update handleSettingsSubmit in App.js
	if storeLocally is false, you may also need to update the compression-related consts

	customComponent is checked within the SettingsForm's render to decide what to use for the field
	it can basically be any string, SettingsForm will just deal with it

	validation is an array of functions that take the setting value and return an error message (or null if no error)
	the later in the list, the higher priority the error has

	if storeLocally is true, setting will be saved in localStorage and excluded from save files
*/
export const SETTINGS_DATA = [
	{
		bgColor: {
			label: "Background",
			fieldProps: {type: "color"}
		},
		fgColor: {
			label: "Foreground",
			fieldProps: {type: "color"}
		},
		colorSwitch: {
			label: null,
			fieldProps: null,
			customComponent: "ColorSwitchButton"
		}
	},
	{
		rows: {
			label: "Rows",
			fieldProps: {
				type: "number",
				min: "5",
				max: "99",
				step: "2"
			},
			validation: [
				value => parseInt(value) < 5 ? "Must be at least 5" : null,
				value => parseInt(value) > 99 ? "Must be 99 or less" : null,
				value => parseInt(value) % 2 === 0 ? "Must be odd" : null
			]
		},
		cols: {
			label: "Columns",
			fieldProps: {
				type: "number",
				min: "5",
				max: "99",
				step: "2"
			},
			validation: [
				value => parseInt(value) < 5 ? "Must be at least 5" : null,
				value => parseInt(value) > 99 ? "Must be 99 or less" : null,
				value => parseInt(value) % 2 === 0 ? "Must be odd" : null
			]
		},
		squareSize: {
			label: "Square Size",
			fieldProps: {
				type: "number",
				min: "6",
				max: "50"
			},
			validation: [
				value => parseInt(value) < 6 ? "Must be at least 6" : null,
				value => parseInt(value) > 50 ? "Must be 50 or less" : null
			]
		}
	},
	{
		showRowNums: {
			label: "Row Labels",
			fieldProps: {type: "checkbox"},
			storeLocally: true
		},
		showDetailedView: {
			label: "Detailed View",
			fieldProps: {type: "checkbox"},
			storeLocally: true
		},
		showGrid: {
			label: "Grid",
			fieldProps: {type: "checkbox"},
			storeLocally: true
		}
	},
	{
		leftHandedMode: {
			label: "Lefty Flip",
			fieldProps: {type: "checkbox"},
			storeLocally: true
		}
	}
];

export const INIT_SETTINGS = {
	rows: 25,
	cols: 25,
	showDetailedView: false,
	showGrid: false,
	bgColor: "#FFFFFF",
	fgColor: "#707070",
	squareSize: 18,
	showRowNums: true,
	leftHandedMode: false
}

export const SETTINGS_STYLE_VARIABLES = {
  bgColor: "--bg-color",
  fgColor: "--fg-color",
  squareSize: "--square-size"
};

// https://github.com/ananthakumaran/u
export const SETTINGS_COMPRESSION_SPEC = {
	grid: ["varchar"],
	bgColor: ["fixedchar", 7],
	fgColor: ["fixedchar", 7],
	rows: ["integer"],
	cols: ["integer"],
	squareSize: ["integer"]
};

export const DEFAULT_TOOL = "Pencil";

// auto converted to first section in toolbar
// when adding a new tool, also update handleSquareInteract in App.js
export const ACTIVE_TOOL_DATA = {
	Pencil: {
		image: pencilIcon,
		cursorImage: pencilIcon,
		cursorX: 0,
		cursorY: 24,
		hotkey: "q",
		tooltip: "Pencil Tool (Q)"
	},
	Eraser: {
		image: eraserIcon,
		cursorImage: eraserIcon,
		cursorX: 0,
		cursorY: 22,
		hotkey: "w",
		tooltip: "Eraser Tool (W)"
	},
	Line: {
		image: lineIcon,
		cursorImage: lineCursor,
		cursorX: 0,
		cursorY: 24,
		hotkey: "e",
		tooltip: "Line Tool (E)"
	},
	Fill: {
		image: fillIcon,
		cursorImage: fillIcon,
		cursorX: 24,
		cursorY: 20,
		hotkey: "r",
		tooltip: "Fill Tool (R)"
	}
};

// each top-layer object is converted to a separate section in the toolbar
// when adding a new tool, also update handlePassiveToolbarClick in App.js
export const PASSIVE_TOOL_DATA = [
	{
		New: {
			image: newIcon,
			hotkey: "n",
			tooltip: "New Pattern (N)"
		},
		Save: {
			image: saveIcon,
			hotkey: "s",
			tooltip: "Save Pattern (S)"
		},
		Load: {
			image: loadIcon,
			hotkey: "o",
			tooltip: "Load Pattern (O)"
		},
		Print: {
			image: printIcon,
			hotkey: "p",
			tooltip: "Print (P)"
		}
	},
	{
		Undo: {
			image: undoIcon,
			hotkey: ["z", "ctrl+z"],
			tooltip: "Undo (Z or ctrl+z)"
		},
		Redo: {
			image: redoIcon,
			hotkey: ["y", "ctrl+y"],
			tooltip: "Redo (Y or ctrl+y)"
		}
	},
	{
		ShiftUp: {
			image: shiftUpIcon,
			hotkey: "i",
			tooltip: "Shift Up (I)"
		},
		ShiftDown: {
			image: shiftDownIcon,
			hotkey: "k",
			tooltip: "Shift Down (K)"
		},
		ShiftLeft: {
			image: shiftLeftIcon,
			hotkey: "j",
			tooltip: "Shift Left (J)"
		},
		ShiftRight: {
			image: shiftRightIcon,
			hotkey: "l",
			tooltip: "Shift Right (L)"
		}
	},
	{
		Random: {
			image: randomIcon,
			hotkey: ";",
			tooltip: "Random Pattern (;)"
		}
	},
	{
		GenerateLink: {
			image: generateLinkIcon,
			hotkey: null,
			tooltip: "Generate Link to Pattern"
		},
		About: {
			image: aboutIcon,
			hotkey: null,
			tooltip: "About"
		}
	}
];

// used by DynamicModal to grab a modal to show
// when adding a new one, update App.js to set state.activeModal to the name string from here
export const MODAL_COMPONENTS = {
	"AboutModal": AboutModal,
	"ShareModal": ShareModal
};