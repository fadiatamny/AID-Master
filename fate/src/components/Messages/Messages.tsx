import styles from './Messages.module.css';
import ScrollToBottom from 'react-scroll-to-bottom'
import Message from './Message/Message';

export interface IMessagesProps {
    messages: Array<string>,
    name: string,
}

export default function Messages (props: IMessagesProps) {
  return (
    <ScrollToBottom className={styles.messages}>
        {props.messages.map((message, i:number) => 
            <div key={i}>
                <Message message={message} name={props.name} />
            </div>)}
    </ScrollToBottom>
  );
}
