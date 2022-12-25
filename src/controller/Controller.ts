import { GameField } from "../model/GameField";
import { fsm } from "./FSM";
import { BattleField } from '../components/battle-field/battle-field';

class Controller {
  private model: GameField;
  private fsm: any;
  private view: BattleField;
  constructor() {
    this.model = new GameField();
    this.fsm = fsm;
    this.view = new BattleField();
  }
}
export const controller = new Controller();