import { MessagesType } from '../controller/FSM';
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

  notifyObservers(eventType: any, message: MessagesType): void {
    this.observers.forEach((elem) => {
      elem.handleEvent(message, eventType);
    });
  }
}
export default EventObservable;
