import { MessagesType } from '../controller/Controller';

interface IObserver {
  handleEvent(eventType: MessagesType, message?: any): void;
}

export default IObserver;
