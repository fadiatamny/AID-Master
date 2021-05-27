import styles from './styles.module.css'
import Input from '../../../../components/Input/Input'
import ChatTitle from './ChatTitle'
import MessagesList from './MessageList'
import { MessageProps } from './MessageList/Message'
import React from 'react'
import EventsManager from '../../../../services/EventsManager'
import { SocketEvents } from '../../../../models/SocketEvents.model'

export interface ChatWindowProps {
    data: Array<MessageProps>
    activeChat: string
    messages: any
    setMessages: any
    username: string
    playerName: string
    rid: string
}

const ChatWindow = ({ data, activeChat, username, playerName, rid, messages, setMessages }: ChatWindowProps) => {
    const eventsManager = EventsManager.instance
    const [message, setMessage] = React.useState('')

    React.useEffect(() => {
        // eventsManager.on(SocketEvents.MESSAGE, 'chat-component', (obj: any) => {
        //     const object = {
        //         username: obj.username,
        //         playerName: obj.username == 'DM' ? 'Kyra Warner' : 'Blake Holt',
        //         messageText: obj.message,
        //         myMessage: obj.username == 'DM' ? true : false
        //     }
        //     console.log(messages)
        //     const tmp = [...messages, object]
        //     console.log(tmp)
        //     setMessages(tmp)
        // })
    }, [])

    const inputChange = (e: any) => {
        setMessage(e.target.value)
    }

    const sendMessage = () => {
        if (activeChat === 'AID Master') {
            eventsManager.trigger(SocketEvents.SEND_SCENARIO, { id: rid, username: username, message: message })
            setMessage('')
        } else {
            eventsManager.trigger(SocketEvents.SEND_MESSAGE, { id: rid, username: username, message: message })
            setMessage('')
        }
    }
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
                        onChange={inputChange}
                        onSubmit={sendMessage}
                        submitOnEnter={true}
                        value={message}
                        submitLabel=">"
                    />
                </div>
            </div>
        </div>
    )
}

export default ChatWindow
