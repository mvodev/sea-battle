import { gameField } from '../../model/GameField';
const generateBtn = document.querySelector('.js-battle-field__generate');
const handleGenerate = () => {
  const generateBtn = document.querySelector('.js-battle-field__generate');
  if (generateBtn) {
    generateBtn.classList.add('hidden');
  }
  const layout = gameField.generateLayout();
  const fieldSize = gameField.getFieldSize();
  const battleField  = document.querySelectorAll('.js-battle-field:not(.js-battle-field_enemy)');
  const cells = battleField[0].querySelectorAll('.js-battle-field__cell');
  console.log(layout);
  layout.forEach((row,rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell !== 0) {
        cells.forEach(cellField => {
          if (cellField.getAttribute(`data-id`)===`${(rowIndex*10)+columnIndex}`){
            cellField.innerHTML = `${cell}`;
          }
        })
      }
    })
  })
}
generateBtn?.addEventListener('pointerdown', handleGenerate.bind(this));