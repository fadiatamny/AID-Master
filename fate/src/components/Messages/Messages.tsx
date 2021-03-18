import styles from './Messages.module.css'
import ScrollToBottom from 'react-scroll-to-bottom'
import Message, { MessageModel } from './Message/Message'

export interface IMessagesProps {
    messages: MessageModel[]
    name: string
}

export default function Messages(props: IMessagesProps) {
    console.log(props.messages.length)
    return (
        <ScrollToBottom className={styles.messages}>
            {props.messages.map((message, i: number) => (
                <div key={i}>
                    <Message message={message} name={props.name} />
                </div>
            ))}
        </ScrollToBottom>
    )
}
