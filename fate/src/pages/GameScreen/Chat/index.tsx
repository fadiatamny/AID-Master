import styles from './styles.module.css'
import React from 'react'
import ChatTabs from './ChatTabs'
import ChatWindow from './ChatWindow'

type MessageType = {
    username: string
    playername: string
    messageText: string | string[]
    myMessage: boolean
}

export interface ChatProps {
    messages: { [key: string]: { playername: string; messages: MessageType[] } }
    rid: string
    username: string
    playername: string
    type: string
}

const Chat = ({ messages, username, playername, type, rid }: ChatProps) => {
    const [activeChat, setActiveChat] = React.useState('All')

    const generateGeneralTabs = () => {
        const generalTabs: Array<{ username: string; playername: string; isActive?: boolean }> = [
            {
                username: 'All',
                playername: 'Game Chat',
                isActive: activeChat === 'All'
            }
        ]
        if (type === 'dm') {
            generalTabs.push({
                username: 'AID Master',
                playername: 'Help',
                isActive: activeChat === 'AID Master'
            })
        }

        return generalTabs
    }

    const generateUserTabs = () => {
        const tabs: Array<{ username: string; playername: string; isActive?: boolean }> = []
        for (const key of Object.keys(messages)) {
            if (key === 'All' || key === 'AID Master' || key === username) {
                continue
            }
            tabs.push({
                username: key,
                playername: messages[key].playername,
                isActive: activeChat === key
            })
        }
        return tabs
    }

    const switchActive = (name: string) => setActiveChat(name)

    return (
        <div className="container-fluid">
            <div className={`row justify-content-center ${styles.container}`}>
                <div className={`col-md-3 col-xl-2`}>
                    <ChatTabs users={generateUserTabs()} general={generateGeneralTabs()} switchActive={switchActive} />
                </div>
                <div className={`col-md-5 col-xl-6`}>
                    <ChatWindow
                        messages={messages[activeChat].messages}
                        username={username}
                        playername={playername}
                        activeChat={activeChat}
                        rid={rid}
                    />
                </div>
            </div>
        </div>
    )
}

export default Chat
