export function getPatternRow(gridIndex, numGridRows) {
	return numGridRows - 2 - gridIndex;
}

export function getRowColor(patternRow) {
	return patternRow % 2 === 0 ? "BG" : "FG";
}

export function getRowSide(patternRow) {
	return patternRow % 4 === 0 || patternRow % 4 === 1 ? "RS": "WS";
}

export function parseStitchRepeats(stitches) {
	const repeats = [];
	for(let j = 0; j < stitches.length; j++) {
		if(j === 0 || stitches[j] !== stitches[j-1]) {
			repeats.push([stitches[j]]);
		} else {
			repeats[repeats.length-1].push(stitches[j]);
		}
	}

	return repeats;
}