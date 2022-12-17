class GameField {
  private empty: number;
  private singleDeck: number;
  private doubleDeck: number;
  private tripleDeck: number;
  private fourDeck: number;
  private fieldSize = 10;

  constructor() {
    this.empty = 0;
    this.singleDeck = 1;
    this.doubleDeck = 2;
    this.tripleDeck = 3;
    this.fourDeck = 4;
  }

  initializeLayout() {
    const field10x10: Array<Array<number>> = [];
    for (let i = 0; i < this.fieldSize; i++) {
      const row = [];
      for (let j = 0; j < this.fieldSize; j++) {
        row.push(this.empty);
      }
      field10x10.push(row);
    }
    return field10x10;
  }

  positionIsAvailable(
    layout: Array<Array<number>>,
    shipSize: number,
    row: number,
    column: number,
    isVertical = true) {
    if (isVertical && (row + shipSize -1) >= this.fieldSize ) {
      return false;
    }
    if (!isVertical && (column + shipSize -1) >= this.fieldSize) {
      return false;
    }
    let cellsToCheck = 9 + (shipSize-1) * 3;
    let upRowToCheck = row -1 >=0 ? row -1 : row;
    let downRowToCheck;
    if (isVertical) {
      downRowToCheck = row + shipSize +1 >= this.fieldSize ? this.fieldSize -1 : row + shipSize +1; 
    } else {
      downRowToCheck = row +1 >= this.fieldSize ? this.fieldSize -1 : row +1;
    }
    let leftColumnToCheck = column -1 < 0 ? 0 : column - 1;
    let rightColumnToCheck;
    if (isVertical) {
      rightColumnToCheck = column + 1 >= this.fieldSize ? this.fieldSize -1 : column + 1;
    } else {
      rightColumnToCheck = column + shipSize +1 >= this.fieldSize ? this.fieldSize -1 : column + shipSize +1;
    }
    for (let row = upRowToCheck; row <= downRowToCheck; row++) {
      for (let column = leftColumnToCheck; column <= rightColumnToCheck; column++) {
        if (layout[row][column] !== this.empty) {
          return false;
        }
      }
    }
    return true;
  }

  generateLayout() {
    const layout = this.initializeLayout();
    const shipsSizes = [4,3,3,2,2,2,1,1,1,1,];
    while (shipsSizes.length > 0) {
      const ship = shipsSizes.pop();
      const row = Math.floor(Math.random() * this.fieldSize);
      const column = Math.floor(Math.random() * this.fieldSize);
      const isVertical = Math.floor(Math.random() * 2) === 0 ? true: false;
    }
    return layout;
  }
}

export const gameField = new GameField();