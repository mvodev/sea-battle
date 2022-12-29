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
        { name: 'starting', from: 'start', to: 'initialyzing' },
        { name: 'generating', from: 'initialyzing', to: 'initialyzing' },
        { name: 'game', from: 'initialyzing', to: 'gamerturn' },
        { name: 'resulting',   from: ['gamerturn','enemyturn'], to: 'result' },
        { name: 'gamer', from: 'enemyturn', to: 'gamerturn'},
        { name: 'enemy', from: 'gamerturn', to: 'enemyturn'},
        { name: 'reseting', from: '*', to: 'i' },
      ],
      methods: {
        onStarting: this.onStarting,
        onGenerating: this.onStarting,
        onGame: this.onGame,
        onEnemy: function() { console.log('I enemy') },
        onExiting: function() { console.log('I exit') },
        onReset: function() { console.log('I reseting') },
      }
    });
    this.view = new BattleField(this.model.generateLayout());
    this.view.addObserver(this);
    this.addObserver(this.model);
    this.model.addObserver(this.view);
  }

  handleEvent(eventType: MessagesType, message?: any): void {
    if (eventType === 'start' && this.fsm.state !== 'initialyzing') {
      this.fsm.starting();
    } else if (eventType === 'start') {
      this.fsm.generating();
    } else if (eventType === 'gamerturn') {
      this.fsm.game();
    }
  }

  private onStarting = () => {
    this.notifyObservers('start');
  }

  private onGame = () => {
    this.notifyObservers('gamerturn');
  }
}
export const controller = new Controller();