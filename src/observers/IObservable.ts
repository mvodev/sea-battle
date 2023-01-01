import { MessagesType } from '../controller/сontroller';
import { Message } from './EventObservable';
import IObserver from './IObserver';

interface IObservable {
  addObserver(o: IObserver): void;
  removeObserver(o: IObserver): void;
  notifyObservers(eventType: MessagesType, message: Message): void;
}

export default IObservable;
