import { MessagesType } from '../../controller/сontroller';
import { CellDroppableInfo, Message } from '../../model/game-field-model';
import EventObservable from '../../observers/EventObservable';
import IObserver from '../../observers/IObserver';
import Ship from '../ship/ship';

export class BattleField extends EventObservable implements IObserver{
  private generateBtn!: HTMLButtonElement | null;
  private startGameBtn!: HTMLButtonElement | null;
  private stopGameBtn!: HTMLButtonElement | null;
  private gamerBattleField!: Element | null;
  private enemyBattleField!: Element | null;
  private enemyCells!: NodeListOf<Element>;
  private gamerCells!: NodeListOf<Element>;
  private generateBtnOwn!: HTMLButtonElement | null;
  private gamerCurtain!: Element | null;
  private enemyCurtain: Element | null | undefined;
  private label!: HTMLSpanElement | null;

  constructor() {
    super();
    this.findElements();
    this.showEnemyCurtain();
    this.showGamerCurtain();
    this.bindEventsListeners();
  }

  private shipCallback = (message: CellDroppableInfo) => {
    this.notifyObservers('create layout', message);
  }

  handleEvent(eventType: MessagesType, message?: Message): void {
    switch(eventType) {
      case 'start':
        this.drawGamerLayout(message?.layout);
        this.generateBtnRemove();
        this.generateBtnByYourselfRemove();
        this.startGameButtonAppear();
        break;
      case 'init game':
        this.generateBtnDisappear();
        this.generateBtnByYourselfDisappear();
        this.startGameBtnDissappear();
        this.stopGameBtnAppear();
        this.hideEnemyCurtain();
        this.showLabel();
        break;
      case 'create layout':
        this.hideGamerCurtain();
        this.generateBtnDisappear();
        this.generateBtnByYourselfDisappear();
        this.startGameBtnDissappear();
        this.markAsShipCells(message);
        break;
      case 'layout created':
        this.startGameButtonAppear();
        break;
      case 'gamerturn':
        this.drawIfHitted(message,'gamerturn');
        if (message && message.isWin) {
          this.showWin(message,'gamerturn');
          this.notifyObservers('result',message);
        } else {
          this.hideLabel();
          this.showEnemyCurtain();
          this.hideGamerCurtain();
          setTimeout(() => { this.notifyObservers('enemyturn') }, 2000);
        }
        break;
      case 'enemyturn':
        this.drawIfHitted(message,'enemyturn');
        if (message && message.isWin) {
          this.showWin(message,'enemyturn');
          this.notifyObservers('result',message);
        } else {
          this.showLabel();
          this.showGamerCurtain();
          this.hideEnemyCurtain();
        }
        break;
      case 'reset':
        this.redrawEmptyField();
        this.generateBtnShow();
        this.generateBtnOwnShow();
        this.startGameBtnDissappear();
        this.stopGameBtnRemove();
        this.showEnemyCurtain();
        this.hideLabel();
        break;
    }
  }

  private showGamerCurtain() {
    this.gamerCurtain?.classList.add('battle-field__cirtain_is-visible');
  }

  private hideGamerCurtain() {
    this.gamerCurtain?.classList.remove('battle-field__cirtain_is-visible');
  }

  private markAsShipCells(message: Message | undefined) {
    if (message && !message.dropped) {
      const {row, column, isVertical, posIsAvailable, shipSize} = message;
      if (row!==undefined && column !== undefined && posIsAvailable !== undefined) {
        this.gamerCells.forEach(cell => {
          cell.classList.remove('battle-field__possible-ship');
        })
        this.gamerCells.forEach(cell => {
          if (cell.getAttribute('data-row') && cell.getAttribute('data-column') &&
              Number(cell.getAttribute('data-row')) === row && 
              Number(cell.getAttribute('data-column')) === column) {
                cell.classList.add('battle-field__possible-ship');
          }
        })
      }
    } else if (message && message.dropped === true) {
      this.gamerCells.forEach(cell => {
        if (cell.classList.contains('battle-field__possible-ship')) {
          cell.classList.remove('battle-field__possible-ship');
          cell.classList.add('battle-field__ship')
        }
      })
    }
  }

  private showWin(message: Message | undefined, field: 'gamerturn' | 'enemyturn') {
    if (this.label && message?.isWin) {
      this.showEnemyCurtain();
      this.showGamerCurtain();
      if (field === 'gamerturn') {
        this.label.innerText = 'Вы выиграли';
      } else this.label.innerText = 'Вы проиграли';
      this.showLabel();
    }
  }

  private findElements() {
    this.generateBtn = document.querySelector('.js-battle-field__generate-btn');
    this.generateBtnOwn = document.querySelector('.js-battle-field__generate-own');
    this.stopGameBtn = document.querySelector('.js-battle-field__stop-btn');
    this.startGameBtn = document.querySelector('.js-battle-field__start-game');
    this.gamerBattleField  = document.querySelectorAll('.js-battle-field:not(.js-battle-field_enemy_field)')[0];
    this.enemyBattleField = document.querySelector('.js-battle-field.battle-field_enemy_field')
    this.gamerCurtain = this.gamerBattleField.querySelector('.js-battle-field__curtain');
    this.enemyCurtain = this.enemyBattleField?.querySelector('.js-battle-field__curtain');
    this.enemyCells  = document.querySelectorAll('.js-battle-field__cell.js-battle-field_enemy_field');
    this.gamerCells = this.gamerBattleField.querySelectorAll('.js-battle-field__cell');
    this.label = document.querySelector('.js-battle-field__hit');
  }

  private bindEventsListeners = () => {
    this.generateBtn?.addEventListener('pointerdown', this.handleGenerate);
    this.startGameBtn?.addEventListener('pointerdown', this.handleStartGame);
    this.stopGameBtn?.addEventListener('pointerdown', this.handleStopGame);
    this.generateBtnOwn?.addEventListener('pointerdown', this.handleGenerateOwn);
    this.enemyCells.forEach(cell => cell.addEventListener('pointerdown',this.handleEnemyField));
  }

  private handleEnemyField = (e:Event) => {
    const battleField = e.target as HTMLDivElement;
    const row = Number(battleField.getAttribute('data-row'));
    const column = Number(battleField.getAttribute('data-column'));
    this.notifyObservers('gamerturn', {row,column});
  }

  private handleGenerateOwn = () => {
    this.notifyObservers('create layout');
    document
    .querySelectorAll('.js-ship')
    .forEach(elem => new Ship(elem as HTMLDivElement,this.shipCallback));
  }

  private handleStopGame = () => {
    this.notifyObservers('reset');
  }

  private handleStartGame = () => {
    this.notifyObservers('init game');
  }

  private redrawEmptyField = () => {
    this.gamerCells.forEach(cell => {
      cell.classList.remove('js-battle-field__ship');
      cell.classList.remove('battle-field__ship');
      cell.classList.remove('battle-field_hitted_cell');
      cell.classList.remove('battle-field_failed_cell');
    });
    this.enemyCells.forEach(cell=>{
      cell.classList.remove('battle-field_hitted_cell');
      cell.classList.remove('battle-field_failed_cell');
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
    this.generateBtn?.classList.add('battle-field_layout-is-active');
  }


  private generateBtnShow() {
    this.generateBtn?.classList.remove('battle-field_layout-is-active');
    this.generateBtn?.classList.remove('battle-field_game_on');
  }

  private generateBtnDisappear() {
    this.generateBtn?.classList.add('battle-field_game_on');
  }

  private generateBtnByYourselfRemove() {
    this.generateBtnOwn?.classList.add('battle-field_layout-is-active');
  }

  private generateBtnOwnShow() {
    this.generateBtnOwn?.classList.remove('battle-field_layout-is-active');
    this.generateBtnOwn?.classList.remove('battle-field_game_on');
  }

  private generateBtnByYourselfDisappear() {
    this.generateBtnOwn?.classList.add('battle-field_game_on');
  }

  private startGameButtonAppear() {
    this.startGameBtn?.classList.add('battle-field_game_on');
  }

  private startGameBtnDissappear() {
    this.startGameBtn?.classList.remove('battle-field_game_on');
  }

  private stopGameBtnAppear() {
    this.stopGameBtn?.classList.remove('battle-field_game_on');
  }

  private stopGameBtnRemove() {
    this.stopGameBtn?.classList.add('battle-field_game_on');
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

  private drawIfHitted(message:Message|undefined, field: 'gamerturn' | 'enemyturn') {
    if (message) {
      const battleField = field === 'gamerturn' ? this.enemyCells : this.gamerCells;
      const {row,column, isHitted} = message;
      if (row!==undefined && column!==undefined ) {
        battleField.forEach(cell => {
          if(cell.getAttribute(`data-id`)===`${(row*10)+column}`) {
            if (isHitted) {
              cell.classList.add('battle-field_hitted_cell');
            } else cell.classList.add('battle-field_failed_cell');
          } 
        })
      }
    }
  }

}