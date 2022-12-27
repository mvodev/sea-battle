import { MessagesType } from '../../controller/FSM';
import { gameField } from '../../model/GameField';
import EventObservable from '../../observers/EventObservable';
import IObserver from '../../observers/IObserver';

export class BattleField extends EventObservable implements IObserver{
  private generateBtn: Element | null;
  private startGameBtn: Element | null;
  private battleField: Element | null;
  private gamerCells: NodeListOf<Element>;
  private generateBtnOwn: Element | null;
  private gamerLayout: number[][];
  private enemyLayout: number[][];

  constructor(gamerLayout:number[][],enemyLayout:number[][]) {
    super();
    this.gamerLayout = gamerLayout;
    this.enemyLayout = enemyLayout;
    this.generateBtn = document.querySelector('.js-battle-field__generate');
    this.generateBtnOwn = document.querySelector('.js-battle-field__generate-own');
    this.startGameBtn = document.querySelector('.js-battle-field__start-game');
    this.gamerLayout= gameField.generateLayout();
    this.enemyLayout= gameField.generateLayout();
    this.battleField  = document.querySelectorAll('.js-battle-field:not(.js-battle-field_enemy)')[0]; 
    this.gamerCells = this.battleField.querySelectorAll('.js-battle-field__cell');
    this.bindEvents();
  }

  handleEvent(eventType: MessagesType, message?: any): void {
    if (eventType === 'init') {
      this.drawGamerLayout(message);
    }
  }

  private bindEvents() {
    this.generateBtn?.addEventListener('pointerdown', this.handleGenerate);
    this.startGameBtn?.addEventListener('pointerdown', this.handleStartGame);
  }

  changeGamerLayout(newLayout: number[][]) {
    this.gamerLayout = newLayout;
  }

  changeEnemyLayout(newLayout: number[][]) {
    this.enemyLayout = newLayout;
  }

  private handleStartGame = () => {
    this.notifyObservers('start');
  }

  private redrawEmptyField() {
    this.gamerCells.forEach(cell => cell.innerHTML = '');
  }

  private drawGamerLayout = (gamerLayout: Array<Array<number>>) => {
    this.redrawEmptyField();
    gamerLayout.forEach((row,rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell !== 0) {
          this.gamerCells.forEach(cellField => {
            if (cellField.getAttribute(`data-id`)===`${(rowIndex*10)+columnIndex}`){
              cellField.innerHTML = `${cell}`;
            }
          })
        }
      })
    })
  }

  private handleGenerate = () => {
    this.notifyObservers('init');
    if (this.generateBtn) {
      this.generateBtn.classList.add('activated');
    }

    if (this.generateBtnOwn) {
      this.generateBtnOwn.classList.add('activated');
    }

  }
}