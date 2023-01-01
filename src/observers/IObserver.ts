import { MessagesType } from '../controller/Controller';
import { Message } from './EventObservable';

interface IObserver {
  handleEvent(eventType: MessagesType, message?: Message): void;
}

export default IObserver;
