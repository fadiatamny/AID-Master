import React from 'react'
import Message, { MessageProps } from './Message'
import styles from './styles.module.css'

export interface MessagesListProps {
    messages: Array<MessageProps>
    activeChat: string
}

const MessagesList = ({ messages, activeChat }: MessagesListProps) => {
    return (
        <div className={`col-11 ${styles.container}`}>
            {messages.map((message, i) => {
                if (activeChat == 'All')
                    return (
                        <div
                            key={i}
                            className={`row ${message.myMessage ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                            <div className={`${styles.messageContainer} `}>
                                <Message
                                    username={message.username}
                                    playername={message.playername}
                                    messageText={message.messageText}
                                    myMessage={message.myMessage}
                                />
                            </div>
                        </div>
                    )
                else if (activeChat == message.username || message.myMessage)
                    return (
                        <div
                            key={i}
                            className={`row ${message.myMessage ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                            <div className={`${styles.messageContainer} `}>
                                <Message
                                    username={message.username}
                                    playername={message.playername}
                                    messageText={message.messageText}
                                    myMessage={message.myMessage}
                                />
                            </div>
                        </div>
                    )
            })}
        </div>
    )
}

export default MessagesList
