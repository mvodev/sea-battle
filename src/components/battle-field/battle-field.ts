import { gameField } from '../../model/GameField';

export class BattleField {
  private generateBtn: Element | null;
  private battleField: Element | null;
  private gamerCells: NodeListOf<Element>;
  private generateBtnOwn: Element | null;
  private gamerLayout: number[][];
  private enemyLayout: number[][];

  constructor() {
    this.generateBtn = document.querySelector('.js-battle-field__generate');
    this.generateBtnOwn = document.querySelector('.js-battle-field__generate-own');
    this.gamerLayout= gameField.generateLayout();
    this.enemyLayout= gameField.generateLayout();
    this.battleField  = document.querySelectorAll('.js-battle-field:not(.js-battle-field_enemy)')[0]; 
    this.gamerCells = this.battleField.querySelectorAll('.js-battle-field__cell');
    this.bindEvents();
  }

  private bindEvents() {
    this.generateBtn?.addEventListener('pointerdown', this.handleGenerate)
  }

  private redrawEmptyField() {
    this.gamerCells.forEach(cell => cell.innerHTML = '');
  }

  private handleGenerate = () => {
    this.redrawEmptyField();

    if (this.generateBtn) {
      this.generateBtn.classList.add('activated');
    }

    if (this.generateBtnOwn) {
      this.generateBtnOwn.classList.add('activated');
    }
    this.gamerLayout.forEach((row,rowIndex) => {
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
}