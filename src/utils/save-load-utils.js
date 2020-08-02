import { SETTINGS_DATA } from "../constants";

export function showLoadingError(msg, ...otherLogs) {
	window.alert(`Error: file is invalid (${msg}).`);
	console.log(...otherLogs);
}

// when settings are loaded from localStorage, ints and bools are strings
// this converts them back
export function convertSettingsValueString(str) {
	if(parseInt(str)) return parseInt(str);
	if(str === "false") return false;
	if(str === "true") return true;
	return str;
}

export function updateLocallyStoredSettings(settings) {
	SETTINGS_DATA.forEach(settingsRow => {
		Object.keys(settingsRow).forEach(settingKey => {
			if(settingsRow[settingKey].storeLocally) {
				localStorage.setItem(settingKey, settings[settingKey]);
			}
		});
	});
}

const base64Encoding = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

export function convertBinaryToBase64String(binary) {
	const remainder = binary.length % 6;
	if(remainder > 0) {
		binary = "0".repeat(6 - remainder) + binary;
	}

	let base64 = "";
	binary.match(/.{1,6}/g).forEach(chunk => {
		base64 += base64Encoding.charAt(parseInt(chunk, 2));
	});

	return base64;
}

export function convertBase64StringToGridData(base64, rows, cols) {
	let binary = "";
	base64.split("").forEach(char => {
		const chunk = base64Encoding.indexOf(char).toString(2);
		binary += chunk.padStart(6, "0");
	});

	const expectedLength = rows * cols;
	const paddingLength = binary.length - expectedLength;
	binary = binary.substring(paddingLength);

	return binary.match(new RegExp(`.{1,${cols}}`, "g"));
}

export function generateSaveObject(grid, settings) {
	const save = {};

	let gridStr = "";
	for(let i = 0; i < grid.length; i++) {
	  for(let j = 0; j < grid[i].length; j++) {
	    gridStr += grid[i][j] ? "1" : "0";
	  }
	}

	gridStr = convertBinaryToBase64String(gridStr);
	save.grid = gridStr;

	SETTINGS_DATA.forEach(settingsRow => {
	  Object.keys(settingsRow).forEach(settingKey => {
	    if(!settingsRow[settingKey].storeLocally && settings[settingKey]) {
	    	save[settingKey] = settings[settingKey];
	    }
	  });
	});

	return save;
}