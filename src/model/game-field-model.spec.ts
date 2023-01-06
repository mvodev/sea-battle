import { gameField } from '../model/game-field-model';

describe('GameField class positionIsAvailable method test ', () => {

  const layout = gameField.initializeLayout();

  it('check true equal true', async () => {
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 4 0 0 0 0 0 0 0 0 
    // 0 4 0 0 0 0 0 0 0 0 
    // 0 4 0 0 0 0 0 0 0 0 
    // 0 4 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    const positionIsAvailable = gameField.positionIsAvailable(layout,4,1,1,true);
    expect(positionIsAvailable).toEqual(true);
  });

  it('check true equal true', async () => {
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 4 0 0 0 0 0 0 0 0
    //   4
    //   4
    //   4 
    const positionIsAvailable = gameField.positionIsAvailable(layout,4,9,1,true);
    expect(positionIsAvailable).toEqual(false);
  });

  it('check true equal true', async () => {
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 1 
    const positionIsAvailable = gameField.positionIsAvailable(layout,1,9,9);
    expect(positionIsAvailable).toEqual(true);
  });

  it('check true equal true', async () => {
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 3 3 3 
    const positionIsAvailable = gameField.positionIsAvailable(layout,3,9,9, true);
    expect(positionIsAvailable).toEqual(false);
  });

  it('check true equal true', async () => {
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 3 3 3 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    const positionIsAvailable = gameField.positionIsAvailable(layout,3,3,0, false);
    expect(positionIsAvailable).toEqual(true);
  });

  it('check true equal true', async () => {
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 3 3 3 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    const positionIsAvailable = gameField.positionIsAvailable(layout,3,3,8, false);
    expect(positionIsAvailable).toEqual(false);
  });

  it('check true equal true', async () => {
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 3 3 3 0 0 0 0 0 
    // 0 0 3 3 3 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    layout[2][2] = 3;
    layout[2][3] = 3;
    layout[2][4] = 3;
    const positionIsAvailable = gameField.positionIsAvailable(layout,3,3,8, false);
    expect(positionIsAvailable).toEqual(false);
  });

  it('check true equal true', async () => {
    // 0 0 0 0 0 0 0 0 4 4 4 4 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0 0 0

    layout[2][2] = 0;
    layout[2][3] = 0;
    layout[2][4] = 0;
    const positionIsAvailable = gameField.positionIsAvailable(layout,4,0,8,false);
    expect(positionIsAvailable).toEqual(false);
  });

});

describe('GameField class test returnPriorityGoalResults', () => {

  it('check true equal true', async () => {
    expect(true).toEqual(false);
  });

});
