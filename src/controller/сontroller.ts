import StateMachine from 'javascript-state-machine';

import { GameField } from "../model/game-field-model";
import { BattleField } from '../components/battle-field/battle-field';
import IObserver from "../observers/IObserver";
import EventObservable, { Message } from '../observers/EventObservable';

export type MessagesType = 'gamerturn' | 'enemyturn' | 'result' | 'reset' | 'start' | 'start game' | 'create layout';
export type FsmType = {
  transition: string; 
  from: string;
  to: string;
  fsm: Record<string,string>, 
  event: string 
}

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
        { name: 'creating', from: 'start', to: 'create' },
        { name: 'generating', from: 'generate', to: 'generate' },
        { name: 'game', from: ['generate','create'], to: 'gamerturn' },
        { name: 'resulting',   from: ['gamerturn','enemyturn'], to: 'result' },
        { name: 'gamer', from: 'enemyturn', to: 'gamerturn'},
        { name: 'enemy', from: 'gamerturn', to: 'enemyturn'},
        { name: 'reseting', from: '*', to: 'start' },
      ],
      methods: {
        onStarting: this.onStarting,
        onCreating: this.onCreating,
        onGenerating: this.onStarting,
        onGame: this.onGame,
        onResult: () => console.log('on result'),
        onGamer: this.onGamerTurn,
        onEnemy: this.onEnemyTurn,
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
    } else if (eventType === 'start game') {
      this.fsm.game();
    } else if (eventType === 'gamerturn') {
      this.fsm.enemy(message);
    } else if (eventType === 'enemyturn') {
      this.fsm.gamer(message);
    } else if (eventType === 'reset') {
      this.fsm.reseting();
    }
  }

  private onStarting = () => {
    this.notifyObservers('start');
  }

  private onGame = () => {
    this.notifyObservers('start game');
  }

  private onReset = () => {
    this.notifyObservers('reset');
  }

  private onCreating = () => {
    this.notifyObservers('create layout');
  }

  private onEnemyTurn = (transtition: FsmType, message: Message) => {
    this.notifyObservers('gamerturn', message);
  }
  private onGamerTurn = (transtition: FsmType, message: Message) => {
    this.notifyObservers('enemyturn', message);
  }
}

export const controller = new Controller();
