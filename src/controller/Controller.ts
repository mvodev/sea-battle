import { GameField } from "../model/GameField";
import { fsm } from "./FSM";

class Controller {
  private model: GameField;
  private fsm: any;
  constructor() {
    this.model = new GameField();
    this.fsm = fsm;
    console.log(this.fsm.state);
  }
}
export const controller = new Controller();