import { MessagesType } from '../../controller/сontroller';
import EventObservable, { Message } from '../../observers/EventObservable';
import IObserver from '../../observers/IObserver';

export class BattleField extends EventObservable implements IObserver{
  private generateBtn: HTMLButtonElement | null;
  private startGameBtn: HTMLButtonElement | null;
  private stopGameBtn: HTMLButtonElement | null;
  private gamerBattleField: Element | null;
  private enemyBattleField : Element | null;
  private enemyCells: NodeListOf<Element>;
  private gamerCells: NodeListOf<Element>;
  private generateBtnOwn: HTMLButtonElement | null;
  private gamerCurtain: Element | null;
  private enemyCurtain: Element | null | undefined;
  private label: HTMLSpanElement | null;

  constructor() {
    super();
    this.generateBtn = document.querySelector('.js-battle-field__generate-btn');
    this.generateBtnOwn = document.querySelector('.js-battle-field__generate-own');
    this.stopGameBtn = document.querySelector('.js-battle-field__stop-btn');
    this.startGameBtn = document.querySelector('.js-battle-field__start-game');
    this.gamerBattleField  = document.querySelectorAll('.js-battle-field:not(.js-battle-field_enemy)')[0];
    this.enemyBattleField = document.querySelector('.js-battle-field.battle-field_enemy')
    this.gamerCurtain = this.gamerBattleField.querySelector('.js-battle-field__curtain');
    this.enemyCurtain = this.enemyBattleField?.querySelector('.js-battle-field__curtain');
    this.enemyCells  = document.querySelectorAll('.js-battle-field__cell.js-battle-field_enemy');
    this.gamerCells = this.gamerBattleField.querySelectorAll('.js-battle-field__cell');
    this.label = document.querySelector('.js-battle-field__hit');
    this.bindEvents();
  }

  handleEvent(eventType: MessagesType, message?: Message): void {
    if (eventType === 'start') {
      this.drawGamerLayout(message?.layout);
      this.generateBtnRemove();
      this.generateBtnOwnRemove();
      this.startGameButtonShow();
    } else if (eventType === 'start game') {
      this.startGameBtnRemove();
      this.stopGameBtnShow();
      this.showLabel();
    } else if (eventType === 'gamerturn') {
      this.drawIfHitted(message);
      this.hideLabel();
      this.showEnemyCurtain();
    } else if (eventType === 'enemyturn') {
      this.showLabel();
    } else if (eventType === 'reset') {
      this.redrawEmptyField();
      this.generateBtnShow();
      this.generateBtnOwnShow();
      this.startGameButtonRemove();
      this.stopGameBtnRemove();
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
    const row = Number(target.getAttribute('data-row'));
    const column = Number(target.getAttribute('data-column'));
    this.notifyObservers('gamerturn', {row,column});
  }

  private handleStopGame = () => {
    this.notifyObservers('reset');
  }

  private handleStartGame = () => {
    this.notifyObservers('start game');
  }

  private redrawEmptyField = () => {
    this.gamerCells.forEach(cell => {
      cell.classList.remove('js-battle-field__ship');
      cell.classList.remove('battle-field__ship');
    });
    this.enemyCells.forEach(cell=>{
      cell.classList.remove('battle-field_hitted');
      cell.classList.remove('battle-field_failed');
    })
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
  private generateBtnShow() {
    this.generateBtn?.classList.remove('battle-field_game-is-active');
  }

  private generateBtnOwnRemove() {
    this.generateBtnOwn?.classList.add('battle-field_game-is-active');
  }
  private generateBtnOwnShow() {
    this.generateBtnOwn?.classList.remove('battle-field_game-is-active');
  }

  private startGameButtonShow() {
    this.startGameBtn?.classList.remove('battle-field_game-is-active');
  }
  private startGameButtonRemove() {
    this.startGameBtn?.classList.add('battle-field_game-is-active');
  }

  private startGameBtnRemove() {
    this.startGameBtn?.classList.add('battle-field_game-is-active');
  }

  private stopGameBtnShow() {
    this.stopGameBtn?.classList.remove('battle-field_game-is-active');
  }

  private stopGameBtnRemove() {
    this.stopGameBtn?.classList.add('battle-field_game-is-active');
  }

  private showLabel() {
    this.label?.classList.add('battle-field__hit_gamer-turn');
  }

  private hideLabel() {
    this.label?.classList.remove('battle-field__hit_gamer-turn');
  }

  private showEnemyCurtain() {
    this.enemyCurtain?.classList.add('battle-field__cirtain_is-visible');
  }

  private hideEnemyCurtain() {
    this.enemyCurtain?.classList.remove('battle-field__cirtain_is-visible');
  }

  private drawIfHitted(message:Message|undefined) {
    if (message) {
      const {row,column, isHitted} = message;
      if (row!==undefined && column!==undefined ) {
        this.enemyCells.forEach(cell =>{
          if(cell.getAttribute(`data-id`)===`${(row*10)+column}`) {
            if (isHitted) {
              cell.classList.add('battle-field_hitted');
            } else cell.classList.add('battle-field_failed');
          } 
        })
      }
    }
  }

}