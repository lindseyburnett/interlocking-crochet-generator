function isOdd(num) {
	return num % 2 === 1;
}

export function isSquareEdge(row, col, grid) {
	return (
		row % (grid.length-1) === 0 || 
		col % (grid[row].length-1) === 0 ||
		grid[row][col] === undefined
	);
}

export function isSquareDot(row, col) {
	return isOdd(row) && isOdd(col);
}

export function isSquareLine(row, col) {
	return isOdd(row) !== isOdd(col);
}

export function getSquareLineDirection(row, col) {
	if(!isSquareLine(row, col)) return null;
	return isOdd(row) ? "horiz" : "vert";
}

export function isSquareValid(row, col, grid) {
	return !isSquareEdge(row, col, grid) && isSquareLine(row, col);
}