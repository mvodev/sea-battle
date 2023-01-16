import { MessagesType } from '../controller/сontroller';
import { Message } from '../model/game-field-model';
import IObservable from './IObservable';
import IObserver from './IObserver';

class EventObservable implements IObservable {
  private observers: Array<IObserver>;

  constructor() {
    this.observers = [];
  }

  addObserver(o: IObserver): void {
    this.observers.push(o);
  }

  removeObserver(o: IObserver): void {
    this.observers = this.observers.filter((subscriber) => subscriber !== o);
  }

  notifyObservers( eventType: MessagesType, message?: Message): void {
    this.observers.forEach((elem) => {
      elem.handleEvent(eventType, message);
    });
  }
}

export default EventObservable;
