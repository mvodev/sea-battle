import StateMachine from 'javascript-state-machine';

import { GameField } from "../model/GameFieldModel";
import { BattleField } from '../components/battle-field/battle-field';
import IObserver from "../observers/IObserver";
import EventObservable from '../observers/EventObservable';

export type MessagesType = 'gamerturn' | 'enemyturn' | 'result' | 'reset' | 'start';

class Controller extends EventObservable implements IObserver{
  private model: GameField;
  private fsm: any;
  private view: BattleField;

  constructor() {
    super();
    this.model = new GameField();
    this.fsm = new StateMachine({
    init: 'start',
      transitions: [
        { name: 'starting', from: 'start', to: 'generate' },
        { name: 'generating', from: 'generate', to: 'generate' },
        { name: 'game', from: 'generate', to: 'gamerturn' },
        { name: 'resulting',   from: ['gamerturn','enemyturn'], to: 'result' },
        { name: 'gamer', from: 'enemyturn', to: 'gamerturn'},
        { name: 'enemy', from: 'gamerturn', to: 'enemyturn'},
        { name: 'reseting', from: '*', to: 'start' },
      ],
      methods: {
        onStarting: this.onStarting,
        onGenerating: this.onStarting,
        onGame: this.onGame,
        onResult: () => console.log('on result'),
        onGamer: function() { console.log('I gamer') },
        onEnemy: function() { console.log('I enemy') },
        onReseting: this.onReset,
      }
    });
    this.view = new BattleField();
    this.view.addObserver(this);
    this.addObserver(this.model);
    this.model.addObserver(this.view);
  }

  handleEvent(eventType: MessagesType, message?: any): void {
    if (eventType === 'start' && this.fsm.state !== 'generate') {
      this.fsm.starting();
    } else if (eventType === 'start') {
      this.fsm.generating();
    } else if (eventType === 'gamerturn') {
      this.fsm.game();
    } else if (eventType === 'reset') {
      this.fsm.reseting();
    }
  }

  private onStarting = () => {
    this.notifyObservers('start');
  }

  private onGame = () => {
    this.notifyObservers('gamerturn');
  }

  private onReset = () => {
    this.notifyObservers('reset');
  }
}
export const controller = new Controller();