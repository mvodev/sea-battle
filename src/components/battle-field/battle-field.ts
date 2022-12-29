import { MessagesType } from '../../controller/Controller';
import { gameField } from '../../model/GameFieldModel';
import EventObservable from '../../observers/EventObservable';
import IObserver from '../../observers/IObserver';

export class BattleField extends EventObservable implements IObserver{
  private generateBtn: Element | null;
  private startGameBtn: HTMLButtonElement | null;
  private stopGameBtn: Element | null;
  private battleField: Element | null;
  private enemyCells: NodeListOf<Element>;
  private gamerCells: NodeListOf<Element>;
  private generateBtnOwn: Element | null;
  private gamerLayout: number[][];

  constructor(gamerLayout:number[][]) {
    super();
    this.gamerLayout = gamerLayout;
    this.generateBtn = document.querySelector('.js-battle-field__generate-btn');
    this.generateBtnOwn = document.querySelector('.js-battle-field__generate-own');
    this.stopGameBtn = document.querySelector('.js-battle-field__stop-btn');
    this.startGameBtn = document.querySelector('.js-battle-field__start-game');
    if (this.startGameBtn) {
      this.startGameBtn.disabled = true;
    }
    this.battleField  = document.querySelectorAll('.js-battle-field:not(.js-battle-field_enemy)')[0]; 
    this.enemyCells  = document.querySelectorAll('.js-battle-field__cell.js-battle-field_enemy');
    this.gamerCells = this.battleField.querySelectorAll('.js-battle-field__cell');
    this.bindEvents();
  }

  handleEvent(eventType: MessagesType, message?: any): void {
    if (eventType === 'start') {
      this.drawGamerLayout(message);
      this.generateBtn?.classList.add('battle-field_game-is-active');
      this.generateBtnOwn?.classList.add('battle-field_game-is-active');
      if (this.startGameBtn) {
        this.startGameBtn.disabled = false;
      }
    } else if (eventType === 'gamerturn') {
      if (this.startGameBtn) {
        this.startGameBtn.classList.add('battle-field_game-is-active');
      }
      if (this.stopGameBtn) {
        this.stopGameBtn.classList.remove('battle-field_game-is-active');
      }
    }
  }

  private bindEvents() {
    this.generateBtn?.addEventListener('pointerdown', this.handleGenerate);
    this.startGameBtn?.addEventListener('pointerdown', this.handleStartGame);
    this.stopGameBtn?.addEventListener('pointerdown', this.handleStopGame);
    this.enemyCells.forEach(cell => cell.addEventListener('pointerdown',this.handleEnemyField));
  }

  private handleEnemyField = (e:Event) => {
    console.log(e);
  }

  private handleStopGame = () =>{
    // this.stopGameBtn?.classList.add('battle-field_game-is-active');
    // this.startGameBtn?.classList.remove('battle-field_game-is-active');
    // this.generateBtn?.classList.remove('battle-field_game-is-active');
    // this.generateBtnOwn?.classList.remove('battle-field_game-is-active');
    // this.redrawEmptyField();
    this.notifyObservers('reset');
  }

  changeGamerLayout(newLayout: number[][]) {
    this.gamerLayout = newLayout;
  }

  private handleStartGame = () => {
    this.notifyObservers('gamerturn');
    // this.stopGameBtn?.classList.remove('battle-field_game-is-active');
    // this.startGameBtn?.classList.add('battle-field_game-is-active');
    // this.generateBtn?.classList.add('battle-field_game-is-active');
    // this.generateBtnOwn?.classList.add('battle-field_game-is-active');
  }

  private redrawEmptyField() {
    this.gamerCells.forEach(cell => {
      cell.classList.remove('js-battle-field__ship');
      cell.classList.remove('battle-field__ship');
    });
  }

  private drawGamerLayout = (gamerLayout: Array<Array<number>>) => {
    this.redrawEmptyField();
    gamerLayout.forEach((row,rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell !== 0) {
          this.gamerCells.forEach(cellField => {
            if (cellField.getAttribute(`data-id`)===`${(rowIndex*10)+columnIndex}`){
              cellField.classList.add('js-battle-field__ship');
              cellField.classList.add('battle-field__ship');
            }
          })
        }
      })
    })
  }

  private handleGenerate = () => {
    this.notifyObservers('start');
  }
}