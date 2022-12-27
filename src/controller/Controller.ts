import StateMachine from 'javascript-state-machine';

import { GameField } from "../model/GameField";
import { BattleField } from '../components/battle-field/battle-field';
import IObserver from "../observers/IObserver";
import EventObservable from '../observers/EventObservable';

export type MessagesType = 'gamerturn' | 'enemyturn' | 'result' | 'reset' | 'init' | 'start';

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
        { name: 'starting', from: 'start', to: 'initialyzing' },
        { name: 'initializing', from: 'initialyzing', to: 'starting' },
        { name: 'starting', from: 'starting', to: 'gamerturn' },
        { name: 'resulting',   from: ['gamerturn','enemyturn'], to: 'result' },
        { name: 'gamer', from: 'enemyturn', to: 'gamerturn'},
        { name: 'enemy', from: 'gamerturn', to: 'enemyturn'},
        { name: 'reseting', from: '*', to: 'i' },
      ],
      methods: {
        onStarting: () => {},
        onInitializing: this.onInitializing,
        onExiting: function() { console.log('I exit') },
        onGamer: function() { console.log('I gamer') },
        onEnemy: function() { console.log('I enemy') },
        onReset: function() { console.log('I reseting') },
      }
    });
    this.view = new BattleField(this.model.generateLayout(),this.model.generateLayout());
    this.view.addObserver(this);
    this.addObserver(this.model);
    this.model.addObserver(this.view);
    this.fsm.starting();
  }

  handleEvent(eventType: MessagesType, message?: any): void {
    if (eventType === 'init') {
      this.fsm.initializing();
    }
  }

  private onInitializing = () => {
    this.notifyObservers('init');
  }
}
export const controller = new Controller();