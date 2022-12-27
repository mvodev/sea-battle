import { MessagesType } from '../controller/FSM';

interface IObserver {
  handleEvent(eventType: MessagesType, message?: any): void;
}
export default IObserver;
