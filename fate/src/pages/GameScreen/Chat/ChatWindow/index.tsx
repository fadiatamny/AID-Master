import React from 'react'
import Button from '../../../../components/Button/Button'
import Input from '../../../../components/Input/Input'
import ChatTitle from './ChatTitle'
import MessagesList from './MessageList'
import { MessageProps } from './MessageList/Message'
import styles from './styles.module.css'

export interface ChatWindowProps{
    data: Array<MessageProps>
    activeChat: string
}

const ChatWindow = ({data, activeChat} : ChatWindowProps) => {
    return (
        <div className="col">
            <div className={`${styles.container}`}>
                <div className={`row justify-content-center`}>
                    <ChatTitle />
                </div>
                <div className="row justify-content-center" style={{ height: '85%' }}>
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
