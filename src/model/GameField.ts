class GameField {
  private empty: number;
  private singleDeck: number;
  private doubleDeck: number;
  private tripleDeck: number;
  private fourDeck: number;
  private FIELD_SIZE = 10;

  constructor() {
    this.empty = 0;
    this.singleDeck = 1;
    this.doubleDeck = 2;
    this.tripleDeck = 3;
    this.fourDeck = 4;
  }

  getFieldSize() {
    return this.FIELD_SIZE;
  }

  initializeLayout() {
    const field10x10: Array<Array<number>> = [];
    for (let i = 0; i < this.FIELD_SIZE; i++) {
      const row:Array<number> = [];
      for (let j = 0; j < this.FIELD_SIZE; j++) {
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
    if (isVertical && (row + shipSize -1) >= this.FIELD_SIZE ) {
      return false;
    }
    if (!isVertical && (column + shipSize -1) >= this.FIELD_SIZE) {
      return false;
    }
    let upRowToCheck = row -1 >=0 ? row -1 : 0;
    let downRowToCheck;
    if (isVertical) {
      downRowToCheck = row + shipSize +1 >= this.FIELD_SIZE ? this.FIELD_SIZE -1 : row + shipSize +1; 
    } else {
      downRowToCheck = row +1 >= this.FIELD_SIZE ? this.FIELD_SIZE -1 : row +1;
    }
    let leftColumnToCheck = column -1 < 0 ? 0 : column - 1;
    let rightColumnToCheck:number;
    if (isVertical) {
      rightColumnToCheck = column + 1 >= this.FIELD_SIZE ? this.FIELD_SIZE -1 : column + 1;
    } else {
      rightColumnToCheck = column + shipSize +1 >= this.FIELD_SIZE ? this.FIELD_SIZE -1 : column + shipSize +1;
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
    const shipsSizes = [
      this.doubleDeck,
      this.doubleDeck,
      this.doubleDeck,
      this.singleDeck,
      this.singleDeck,
      this.singleDeck,
      this.singleDeck,
      this.fourDeck,
      this.tripleDeck,
      this.tripleDeck,
    ];
    const obj:any = {};
    while (shipsSizes.length > 0) {
      const shipSize = shipsSizes.pop() as number;
      while (true) {
        const date = Date.now();
        const row = Math.floor(Math.random() * this.FIELD_SIZE);
        const column = Math.floor(Math.random() * this.FIELD_SIZE);
        const isVertical = Math.floor(Math.random() * 2) === 0 ? true: false;
        if (this.positionIsAvailable(layout, shipSize, row, column, isVertical)) {
          layout[row][column] = shipSize;
          if (shipSize >1) {
            let cellsToMark = shipSize - 1;
            while(cellsToMark >0) {
              if (isVertical) {
                layout[row+cellsToMark][column] = shipSize;
              } else {
                layout[row][column+cellsToMark] = shipSize;
              }
              cellsToMark--;
            }
          }
          break;
        }
        const date2 = Date.now();
        if (date2 - date > 100) {
          obj.shipSize = shipSize;
          obj.row = row;
          obj.column = column;
          obj.isVertical = isVertical;
          console.log('obj');
          console.log(obj);
        }
      }
    }
    return layout;
  }
}

export const gameField = new GameField();