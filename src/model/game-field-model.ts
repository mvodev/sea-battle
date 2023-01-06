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
  private enemyNumberOfShipsQuantity = 4 + 3*2 + 2*3 + 4*1;
  private gamerNumberOfShipsQuantity = 4 + 3*2 + 2*3 + 4*1;
  private FIELD_SIZE = 10;
  private gamerLayout: number[][] = [];
  private enemyLayout: number[][] = [];
  private alreadyHittedCell:{
    row:number;
    column: number;
  } | null = null;
  private priorityGoals: Array<{
      row: number;
      column: number;
    }> = [];

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
          const item = this.getGamerResults(message)!;
          const {row,column,isHitted,isWin} = item;
          this.enemyLayout[row][column] = this.IS_HEATED;
          this.notifyObservers('gamerturn', { isHitted, row, column, isWin }); 
        }
        break;
      case 'reset':
        this.gamerLayout = [];
        this.enemyLayout = [];
        this.notifyObservers('reset');
        break;
      case 'enemyturn':
        const { row, column , isHitted, isWin} = this.getAIResults()!;
        this.gamerLayout[row][column] = this.IS_HEATED;
        this.notifyObservers('enemyturn', { isHitted, row, column, isWin });
        break;
    }
  }

  private getAIResults = () => {
    let row = 0;
    let column = 0;
    console.log(this.priorityGoals);
    console.log(this.alreadyHittedCell);
    if (this.priorityGoals.length > 0 || this.alreadyHittedCell)  {
      console.log('inside this.priorityGoals.length > 0 || this.alreadyHittedCell');
      if (this.priorityGoals.length === 0) {
        console.log('inside this.priorityGoals.length === 0');
        const rowHitted = this.alreadyHittedCell?.row!;
        const columnHitted = this.alreadyHittedCell?.column!;
        if (rowHitted - 1 >=0 && this.gamerLayout[rowHitted-1][columnHitted]!== this.IS_HEATED) {
          this.priorityGoals.push({
            row: rowHitted - 1,column:columnHitted
          });
        }
        if (rowHitted + 1 < this.FIELD_SIZE && this.gamerLayout[rowHitted + 1][columnHitted]!== this.IS_HEATED) {
          this.priorityGoals.push({
            row:rowHitted + 1,column:columnHitted
          });
        }
        if (columnHitted -1 >=0 && this.gamerLayout[rowHitted][columnHitted - 1] !== this.IS_HEATED) {
          this.priorityGoals.push({
            row:rowHitted, column: columnHitted - 1
          })
        }
        if (columnHitted + 1 < this.FIELD_SIZE && this.gamerLayout[rowHitted][columnHitted + 1] !== this.IS_HEATED) {
          this.priorityGoals.push({
            row:rowHitted, column: columnHitted + 1
          })
        };
        const item = this.priorityGoals.pop();
        if (item) {
          row = item.row;
          column = item.column;
          if (this.gamerLayout[row][column] !== this.EMPTY) {
            if (this.alreadyHittedCell?.row === row) {
              this.priorityGoals = this.priorityGoals.filter( goal => goal.row === this.alreadyHittedCell?.row);
            } else {
              this.priorityGoals = this.priorityGoals.filter( goal => goal.column === this.alreadyHittedCell?.column)
            }
          }
          if (this.priorityGoals.length === 0) this.alreadyHittedCell = null;
        }
      } else {
        console.log('inside ELSE this.priorityGoals.length !== 0');
        const item = this.priorityGoals.pop();
        if (item) {
          row = item.row;
          column = item.column;
          console.log('item');
          console.log(item);
          if (this.gamerLayout[row][column] !== this.EMPTY && this.gamerLayout[row][column] !== this.IS_HEATED) {
            console.log('this.gamerLayout[row][column] !== this.EMPTY && this.gamerLayout[row][column] !== this.IS_HEATED');
            if (this.alreadyHittedCell?.row === row) {
              console.log('this.alreadyHittedCell?.row === row');
              this.priorityGoals = this.priorityGoals.filter( goal => goal.row === this.alreadyHittedCell?.row);
              if (column  - this.alreadyHittedCell.column > 0 && column + 1 < this.FIELD_SIZE) {
                console.log('this.priorityGoals.push({ row, column: column + 1})');
                this.priorityGoals.push({ row, column: column + 1});
              }
              if (column -1 >=0 ) {
                console.log('this.priorityGoals.push({ row, column: column - 1})');
                this.priorityGoals.push({ row, column: column - 1});
              }
            } else if (this.alreadyHittedCell?.column === column) {
              console.log('this.alreadyHittedCell?.column === column');
              this.priorityGoals = this.priorityGoals.filter( goal => goal.column === this.alreadyHittedCell?.column);
              if (this.alreadyHittedCell && row  - this.alreadyHittedCell.row > 0 && row + 1 < this.FIELD_SIZE) {
                this.priorityGoals.push({ row: row+1, column});
                console.log('this.priorityGoals.push({ row: row+1, column})');
              }
              if (row -1 >=0) {
                console.log('this.priorityGoals.push({ row: row-1, column})');
                this.priorityGoals.push({ row: row-1, column});
              }
            }
          }
          if (this.priorityGoals.length === 0) this.alreadyHittedCell = null;
        }
      }
    } else {
      while(true) {
        row = Math.floor(Math.random() * this.FIELD_SIZE);
        column = Math.floor(Math.random() * this.FIELD_SIZE);
        if (this.gamerLayout[row][column] !== this.IS_HEATED) break;
      }
    }
    const isHitted = this.gamerLayout[row][column] !== this.EMPTY && this.gamerLayout[row][column] !== this.IS_HEATED;
    if (isHitted) {
      this.gamerNumberOfShipsQuantity--;
      if (!this.alreadyHittedCell) {
        this.alreadyHittedCell = { row,column };
      }
    }
    const isWin = this.gamerNumberOfShipsQuantity === 0;
    console.log(this.priorityGoals);
    console.log(this.alreadyHittedCell);
    return {
      row,
      column,
      isHitted,
      isWin
    }
  }

  private getGamerResults = (message:Message) => {
    const { row, column } = message;
    if (row !== undefined && column !== undefined) {
      const isHitted = this.enemyLayout[row][column] !== this.EMPTY && this.enemyLayout[row][column] !== this.IS_HEATED;
      if (isHitted) {
        this.enemyLayout[row][column] = this.IS_HEATED;
        this.enemyNumberOfShipsQuantity--;
      } 
      const isWin = this.enemyNumberOfShipsQuantity === 0;
      return {row,column,isHitted,isWin}
    }
  }

  getFieldSize() {
    return this.FIELD_SIZE;
  }

  initializeLayout() {
    const field: number[][] = [];
    for (let i = 0; i < this.FIELD_SIZE; i++) {
      const row: number[] = [];
      for (let j = 0; j < this.FIELD_SIZE; j++) {
        row.push(this.EMPTY);
      }
      field.push(row);
    }
    return field;
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