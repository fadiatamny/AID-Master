import styles from './styles.module.css'
import Input from '../../../../components/Input/Input'
import ChatTitle from './ChatTitle'
import MessagesList from './MessageList'
import { MessageProps } from './MessageList/Message'

export interface ChatWindowProps {
    data: Array<MessageProps>
    activeChat: string
}

const ChatWindow = ({ data, activeChat }: ChatWindowProps) => {
    return (
        <div className="col justify-content-center">
            <div className={`${styles.container}`}>
                <div className={`row justify-content-center ${styles.inputHolder}`}>
                    <ChatTitle />
                </div>
                <div className={`row justify-content-center ${styles.messageList} `}>
                    <MessagesList data={data} activeChat={activeChat} />
                </div>
                <div className={`row align-item-end justify-content-center ${styles.inputHolder}`}>
                    <Input
                        placeholder="Enter text here..."
                        id="chatResponse"
                        className={styles.input}
                        onSubmit={() => {
                            console.log('lol')
                        }}
                        submitLabel=">"
                    />
                </div>
            </div>
        </div>
    )
}

export default ChatWindow
