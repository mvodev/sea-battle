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

  notifyObservers( eventType: MessagesType, message?: any): void {
    this.observers.forEach((elem) => {
      elem.handleEvent(eventType, message);
    });
  }
}
export default EventObservable;
