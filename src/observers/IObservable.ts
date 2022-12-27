import { MessagesType } from '../controller/Controller';
import IObserver from './IObserver';

interface IObservable {
  addObserver(o: IObserver): void;
  removeObserver(o: IObserver): void;
  notifyObservers(eventType: any, message: MessagesType): void;
}

export default IObservable;
