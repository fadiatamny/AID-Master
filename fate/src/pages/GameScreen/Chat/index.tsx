import styles from './styles.module.css'
import React from 'react'
import ChatTabs from './ChatTabs'
import EventsManager from '../../../services/EventsManager'
import ChatWindow from './ChatWindow'
import { SocketEvents } from '../../../models/SocketEvents.model'

export interface ChatProps {
    messages?: any
    setMessages?: any
    rid: string
}

const Chat = ({ messages, rid, setMessages }: ChatProps) => {
    const [activeChat, setActiveChat] = React.useState('All')
    const mockDataMessages = [
        {
            username: 'Smittens the Unbreakable',
            playerName: 'Blake Holt',
            messageText: 'A member of the Zhentarim, following a lead that Cult activity was spotted in the area, entered the cave to investigate. He was waylaid by the goblins. Now the goblins are raiding the countryside at the behest of the Cult, ensuring that no more Zhentarim operatives happen across the area.',
            myMessage: false
        },
        {
            username: 'DM',
            playerName: 'Kyra Warner',
            messageText: 'If the goblins are alerted, they shoot through the holes at anyone in the passageway between their wall and the cave entrance. Treat the holes as arrow slits, giving the goblins three-quarters cover.',
            myMessage: true

        }
    ]

    const generateGeneralTabs = () => {
        const generalTabs = [
            { username: 'All', playerName: '' },
            { username: 'AID Master', playerName: 'get some help' }
        ]
        return generalTabs.map((t) => {
            if (activeChat === t.username) {
                t = Object.assign({}, t, { isActive: true })
            }
            return t
        })
    }

    const generateChatTabs = () => {
        const tabs = []
        tabs.push(...mockDataMessages.map((m) => ({ username: m.username, playerName: m.playerName })))
        return tabs.map((t) => {
            if (activeChat === t.username) {
                t = Object.assign({}, t, { isActive: true })
            }
            return t
        })
    }

    const switchActive = (name: string) => setActiveChat(name)

    return (
        <div className="container-fluid">
            <div className={`row justify-content-center ${styles.container}`}>
                <div className={`col-md-3 col-xl-2`}>
                    <ChatTabs users={generateChatTabs()} general={generateGeneralTabs()} switchActive={switchActive} />
                </div>
                <div className={`col-md-5 col-xl-6`}>
                    <ChatWindow
                        data={[...mockDataMessages, ...messages]}
                        messages={messages}
                        setMessages={setMessages}
                        activeChat={activeChat}
                        rid={rid}
                    />
                </div>
            </div>
        </div>
    )
}

export default Chat
