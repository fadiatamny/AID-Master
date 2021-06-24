import React from 'react'
import { Col, Row } from 'react-bootstrap'
import Message, { MessageProps } from './Message'
import styles from './styles.module.css'

export interface MessagesListProps {
    messages: Array<MessageProps>
    activeChat: string
}

const MessagesList = ({ messages, activeChat }: MessagesListProps) => {
    return (
        <Col sm={11} className={`${styles.container}`}>
            {messages.map((message, i) => {
                if (activeChat == 'All')
                    return (
                        <Row
                            key={i}
                            className={`${message.myMessage ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                            <div className={`${styles.messageContainer} `}>
                                <Message
                                    username={message.username}
                                    playername={message.playername}
                                    messageText={message.messageText}
                                    myMessage={message.myMessage}
                                />
                            </div>
                        </Row>
                    )
                else if (activeChat == message.username || message.myMessage)
                    return (
                        <Row
                            key={i}
                            className={`${message.myMessage ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                            <div className={`${styles.messageContainer} `}>
                                <Message
                                    username={message.username}
                                    playername={message.playername}
                                    messageText={message.messageText}
                                    myMessage={message.myMessage}
                                />
                            </div>
                        </Row>
                    )
            })}
        </Col>
    )
}

export default MessagesList
