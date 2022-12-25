import { MessagesType } from '../controller/FSM';

interface IObserver {
  handleEvent(message: any, eventType: MessagesType): void;
}
export default IObserver;
