export function getPatternRow(gridIndex, numGridRows) {
	return numGridRows - 2 - gridIndex;
}

export function getRowColor(patternRow) {
	return patternRow % 2 === 0 ? "BG" : "FG";
}

export function getRowSide(patternRow) {
	return patternRow % 4 === 0 || patternRow % 4 === 1 ? "RS": "WS";
}