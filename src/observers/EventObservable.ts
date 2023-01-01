import { MessagesType } from '../controller/Controller';
import IObservable from './IObservable';
import IObserver from './IObserver';

export type Message = {
  row?:number;
  column?:number;
  layout?:number[][];
}

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
