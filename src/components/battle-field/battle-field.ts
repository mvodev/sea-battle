import { MessagesType } from '../../controller/Controller';
import { gameField } from '../../model/GameFieldModel';
import EventObservable, { Message } from '../../observers/EventObservable';
import IObserver from '../../observers/IObserver';

export class BattleField extends EventObservable implements IObserver{
  private generateBtn: Element | null;
  private startGameBtn: HTMLButtonElement | null;
  private stopGameBtn: Element | null;
  private battleField: Element | null;
  private enemyCells: NodeListOf<Element>;
  private gamerCells: NodeListOf<Element>;
  private generateBtnOwn: Element | null;

  constructor() {
    super();
    this.generateBtn = document.querySelector('.js-battle-field__generate-btn');
    this.generateBtnOwn = document.querySelector('.js-battle-field__generate-own');
    this.stopGameBtn = document.querySelector('.js-battle-field__stop-btn');
    this.startGameBtn = document.querySelector('.js-battle-field__start-game');
    this.battleField  = document.querySelectorAll('.js-battle-field:not(.js-battle-field_enemy)')[0]; 
    this.enemyCells  = document.querySelectorAll('.js-battle-field__cell.js-battle-field_enemy');
    this.gamerCells = this.battleField.querySelectorAll('.js-battle-field__cell');
    this.bindEvents();
  }

  handleEvent(eventType: MessagesType, message?: Message): void {
    if (eventType === 'start') {
      this.drawGamerLayout(message?.layout);
      this.generateBtnRemove();
      this.generateButtonOwnRemove();
      this.startGameButtonShow();
    } else if (eventType === 'gamerturn') {
      this.startGameBtnRemove();
      this.stopGameBtnShow()
    }
  }

  private bindEvents = () => {
    this.generateBtn?.addEventListener('pointerdown', this.handleGenerate);
    this.startGameBtn?.addEventListener('pointerdown', this.handleStartGame);
    this.stopGameBtn?.addEventListener('pointerdown', this.handleStopGame);
    this.enemyCells.forEach(cell => cell.addEventListener('pointerdown',this.handleEnemyField));
  }

  private handleEnemyField = (e:Event) => {
    const target = e.target as HTMLDivElement;
    const row = target.getAttribute('data-row');
    const column = target.getAttribute('data-column');
  }

  private handleStopGame = () => {
    this.notifyObservers('reset');
  }

  private handleStartGame = () => {
    this.notifyObservers('gamerturn');
  }

  private redrawEmptyField = () => {
    this.gamerCells.forEach(cell => {
      cell.classList.remove('js-battle-field__ship');
      cell.classList.remove('battle-field__ship');
    });
  }

  private drawGamerLayout = (gamerLayout?: Array<Array<number>>) => {
    this.redrawEmptyField();
    gamerLayout?.forEach((row,rowIndex) => {
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

  private generateBtnRemove() {
    this.generateBtn?.classList.add('battle-field_game-is-active');
  }

  private generateButtonOwnRemove() {
    this.generateBtnOwn?.classList.add('battle-field_game-is-active');
  }

  private startGameButtonShow() {
    this.startGameBtn?.classList.remove('battle-field_game-is-active');
  }

  private startGameBtnRemove() {
    this.startGameBtn?.classList.add('battle-field_game-is-active');
  }

  private stopGameBtnShow() {
    this.stopGameBtn?.classList.remove('battle-field_game-is-active');
  }

}