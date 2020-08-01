import { deepClone } from "./general-utils";
import { isSquareDot, isSquareEmptyAndValid } from "./square-utils";

// returns a new grid with dots set to true
// does not alter the original grid
// if resetLines is true, will wipe everything else, basically resetting to a blank state
export function initializeDots(grid, resetLines=false) {
  const newGrid = deepClone(grid);

  if(resetLines) {
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        newGrid[i][j] = isSquareDot(i, j);
      }
    }
  } else {
    for(let i = 1; i < grid.length; i += 2) {
      for(let j = 1; j < grid[i].length; j+= 2) {
        newGrid[i][j] = true;
      }
    }
  }

  return newGrid;
}

export function fillRecursively(row, col, grid) {
  if(!isSquareEmptyAndValid(row, col, grid)) {
    return grid;
  } else {
    grid[row][col] = true;

    if(isSquareEmptyAndValid(row-1, col-1, grid)) { // up-left
      grid = fillRecursively(row-1, col-1, grid);
    }

    if(isSquareEmptyAndValid(row-1, col+1, grid)) { // up-right
      grid = fillRecursively(row-1, col+1, grid);
    }

    if(isSquareEmptyAndValid(row+1, col+1, grid)) { // down-right
      grid = fillRecursively(row+1, col+1, grid);
    }

    if(isSquareEmptyAndValid(row+1, col-1, grid)) { // down-left
      grid = fillRecursively(row+1, col-1, grid);
    }

    return grid;
  }
}