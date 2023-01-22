import StateMachine from 'javascript-state-machine';

import { GameField, Message } from "../model/game-field-model";
import { BattleField } from '../components/battle-field/battle-field';
import IObserver from "../observers/IObserver";
import EventObservable from '../observers/EventObservable';

export type MessagesType = 
  'gamerturn'     |
  'enemyturn'     |
  'result'        |
  'reset'         |
  'start'         |
  'init game'    |
  'create layout' |
  'layout created';
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
        { name: 'placing', from: 'create', to: 'create' },
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
        onPlacing: this.onPlacing,
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
    } else if (eventType === 'init game') {
      this.fsm.game();
    } else if (eventType === 'gamerturn') {
      this.fsm.enemy(message);
    } else if (eventType === 'create layout' && this.fsm.state === 'create') {
      this.fsm.placing(message);
    } else if (eventType === 'create layout' && this.fsm.state !== 'create') {
      this.fsm.creating();
    } else if (eventType === 'enemyturn') {
      this.fsm.gamer(message);
    } else if (eventType === 'reset') {
      this.fsm.reseting();
    }
  }

  private onStarting = () => {
    this.notifyObservers('start');
  }

  private onPlacing = (transtition: FsmType, message: Message) => {
    this.notifyObservers('create layout', message);
  }

  private onGame = () => {
    this.notifyObservers('init game');
  }

  private onReset = () => {
    this.notifyObservers('reset');
  }

  private onCreating = (transtition: FsmType, message: Message) => {
    this.notifyObservers('create layout', message);
  }

  private onEnemyTurn = (transtition: FsmType, message: Message) => {
    this.notifyObservers('gamerturn', message);
  }

  private onGamerTurn = (transtition: FsmType, message: Message) => {
    this.notifyObservers('enemyturn', message);
  }
}

export const controller = new Controller();
