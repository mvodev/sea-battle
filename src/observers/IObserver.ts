import { MessagesType } from '../controller/сontroller';
import { Message } from './EventObservable';

interface IObserver {
  handleEvent(eventType: MessagesType, message?: Message): void;
}

export default IObserver;
