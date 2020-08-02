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

export function generateSaveObject(grid, settings) {
	const save = {};

	let gridStr = "";
	for(let i = 0; i < grid.length; i++) {
	  for(let j = 0; j < grid[i].length; j++) {
	    gridStr += grid[i][j] ? "1" : "0";
	  }
	  if(i !== grid.length-1) gridStr += ",";
	}
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