// Represents a css grid
// Utilized to determine layout of elements.
class Grid {
  get cells() {
    return this._cols * this._rows;
  }

  constructor(rows, cols) {
    this._rows = rows;
    this._cols = cols;

    // Represents which cells are empty.
    this._slots = Array(this.cells).fill(true);
  }

  isCellOpen(row, col) {
    return this._slots[row + this.cols * col];
  }

  // Note: the grid is represented with cell indices instead of grid lines like in css. 
  isAreaAvailable(rowStart, rowEnd, colStart, colEnd) {
    let result = true;

    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        result = result && this.isCellOpen(row, col);
      }
    }

    return result;
  }
  
}


export default Grid;