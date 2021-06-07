import styles from './styles.module.css'
import React from 'react'
import ChatTabs from './ChatTabs'
import EventsManager from '../../../services/EventsManager'
import ChatWindow from './ChatWindow'
import { SocketEvents } from '../../../models/SocketEvents.model'
import { MessageProps } from './ChatWindow/MessageList/Message'

export interface ChatProps {
    messages?: any
    setMessages?: any
    rid: string
    username: string
    playerName: string
    type: string
}

const Chat = ({ messages, username, playerName, type, rid, setMessages }: ChatProps) => {
    const [activeChat, setActiveChat] = React.useState('All')
    const mockDataMessages = [
        {
            username: 'Game Bot',
            playerName: 'AID Master Team',
            messageText: `Welcome to the AID Master Game chat ${username}`,
            myMessage: false
        }
    ]

    const generateGeneralTabs = () => {
        let generalTabs = []
        if (type == 'dm')
            generalTabs = [
                { username: 'All', playerName: '' },
                { username: 'AID Master', playerName: 'get some help' }
            ]
        else generalTabs = [{ username: 'All', playerName: '' }]
        return generalTabs.map((t) => {
            if (activeChat === t.username) {
                t = Object.assign({}, t, { isActive: true })
            }
            return t
        })
    }

    const generateChatTabs = () => {
        const tabs: Array<{ username: string; playerName: string; isActive?: boolean }> = []
        if (sessionStorage.getItem('playerlist')) {
            //@ts-ignore
            const stored = sessionStorage.getItem('playerlist') ?? undefined
            const list = stored ? JSON.parse(stored) : undefined
            list?.map((user: any) => {
                tabs.push({
                    username: user.username,
                    playerName: user.playername,
                    isActive: activeChat === user.username
                })
            })
            return tabs
        }
    }

    const switchActive = (name: string) => setActiveChat(name)

    return (
        <div className="container-fluid">
            <div className={`row justify-content-center ${styles.container}`}>
                <div className={`col-md-3 col-xl-2`}>
                    {/* @ts-ignore */}
                    <ChatTabs users={generateChatTabs()} general={generateGeneralTabs()} switchActive={switchActive} />
                </div>
                <div className={`col-md-5 col-xl-6`}>
                    {messages.map((id: number, message: any) => {
                        <ChatWindow
                            data={[...mockDataMessages, message[id]]}
                            messages={messages}
                            setMessages={setMessages}
                            username={username}
                            playerName={playerName}
                            activeChat={activeChat}
                            rid={rid}
                        />
                    })}
                </div>
            </div>
        </div>
    )
}

export default Chat
