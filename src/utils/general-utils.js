import { SETTINGS_STYLE_VARIABLES, SETTINGS_DATA } from "../constants";

export function deepClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

export function showLoadingError(msg) {
	window.alert(`Error: file is invalid (${msg}).`);
}

export function getIndexOfElementInParent(el) {
  return Array.prototype.indexOf.call(el.parentElement.children, el);
}

export function updateSettingsStyleVars(settings) {
	Object.keys(settings).forEach(settingsKey => {
	  const styleVariable = SETTINGS_STYLE_VARIABLES[settingsKey];
	  if(styleVariable) {
	    const settingsValue = settingsKey === "squareSize" ? settings[settingsKey] + "px" : settings[settingsKey];
	    document.documentElement.style.setProperty(styleVariable, settingsValue);
	  }
	});
}

export function updateToolStyleVars(toolData) {
	const doc = document.documentElement;
	doc.style.setProperty("--tool-cursor", `url(${toolData.cursorImage})`);
	doc.style.setProperty("--tool-cursor-x", toolData.cursorX);
	doc.style.setProperty("--tool-cursor-y", toolData.cursorY);
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

// when settings are loaded from txt or localStorage, ints and bools are strings
// this converts them back
export function convertSettingsValueString(str) {
	if(parseInt(str)) return parseInt(str);
	if(str === "false") return false;
	if(str === "true") return true;
	return str;
}