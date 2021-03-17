// import ScrollToBottom from 'react-scroll-to-bottom';
import './Messages.module.css';
import Message from './Message/Message';

export interface IMessagesProps {
    messages: Array<string>,
    name: string,
}

export default function Messages (props: IMessagesProps) {
  return (
    <div>
        {props.messages.map((message, i:number) => 
            <div key={i}>
                <Message message={message} name={props.name} />
            </div>)}
    </div>
  );
}
