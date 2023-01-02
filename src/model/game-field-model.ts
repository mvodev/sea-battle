import { MessagesType } from "../controller/сontroller";
import EventObservable, { Message } from "../observers/EventObservable";
import IObserver from "../observers/IObserver";

export class GameField extends EventObservable implements IObserver{
  private EMPTY: number;
  private SINGLE_DECK: number;
  private DOUBLE_DECK: number;
  private TRIPLE_DECK: number;
  private QUAD_DECK: number;
  private IS_HEATED: number;
  private enemyNumberOfQuantity = 4 + 3*2 + 2*3 + 4*1;
  private gamerNumberOfQuantity = 4 + 3*2 + 2*3 + 4*1;
  private FIELD_SIZE = 10;
  private gamerLayout: Array<Array<number>> = [];
  private enemyLayout: Array<Array<number>> = [];

  constructor() {
    super();
    this.EMPTY = 0;
    this.SINGLE_DECK = 1;
    this.DOUBLE_DECK = 2;
    this.TRIPLE_DECK = 3;
    this.QUAD_DECK = 4;
    this.IS_HEATED = 5;
  }

  handleEvent(eventType: MessagesType, message?: Message): void {
    switch(eventType) {
      case 'start':
        this.gamerLayout = this.generateLayout();
        this.enemyLayout = this.generateLayout();
        this.notifyObservers('start', {
          layout: this.gamerLayout 
        });
        break;
      case 'start game':
        this.notifyObservers('start game');
        break;
      case 'gamerturn':
        if (message) {
          const { row, column } = message;
          if (row !== undefined && column !== undefined) {
            const isHitted = this.enemyLayout[row][column] !== this.EMPTY;
            if (isHitted && this.enemyLayout[row][column] !== this.IS_HEATED) {
              this.enemyLayout[row][column] = this.IS_HEATED;
              this.enemyNumberOfQuantity--;
              const isWin = this.enemyNumberOfQuantity === 0;
              this.notifyObservers('gamerturn', {
                isHitted,row,column,isWin
              });
            } else {
              this.notifyObservers('gamerturn', {
                isHitted,row,column
              });
            };
          }
        }
        break;
      case 'reset':
        this.gamerLayout = [];
        this.enemyLayout = [];
        this.notifyObservers('reset');
        break;
      case 'enemyturn':
        let row,column;
        while(true){
          row = Math.floor(Math.random() * this.FIELD_SIZE);
          column = Math.floor(Math.random() * this.FIELD_SIZE);
          if (this.gamerLayout[row][column] !== this.IS_HEATED) break;
        }
        const isHitted = this.gamerLayout[row][column] !== this.EMPTY;
        this.gamerLayout[row][column] = this.IS_HEATED;
        if (isHitted) this.gamerNumberOfQuantity--;
        const isWin = this.gamerNumberOfQuantity === 0;
        this.notifyObservers('enemyturn', {
          isHitted,row,column,isWin
        });
        break;
    }
  }

  getFieldSize() {
    return this.FIELD_SIZE;
  }

  initializeLayout() {
    const field10x10: Array<Array<number>> = [];
    for (let i = 0; i < this.FIELD_SIZE; i++) {
      const row:Array<number> = [];
      for (let j = 0; j < this.FIELD_SIZE; j++) {
        row.push(this.EMPTY);
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
        if (layout[row][column] !== this.EMPTY) {
          return false;
        }
      }
    }

    return true;
  }

  generateLayout() {
    const layout = this.initializeLayout();
    const shipsSizes = [
      this.DOUBLE_DECK,
      this.DOUBLE_DECK,
      this.DOUBLE_DECK,
      this.SINGLE_DECK,
      this.SINGLE_DECK,
      this.SINGLE_DECK,
      this.SINGLE_DECK,
      this.QUAD_DECK,
      this.TRIPLE_DECK,
      this.TRIPLE_DECK,
    ];
    while (shipsSizes.length > 0) {
      const shipSize = shipsSizes.pop() as number;
      while (true) {
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
      }
    }
    return layout;
  }
}

export const gameField = new GameField();