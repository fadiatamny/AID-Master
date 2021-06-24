import styles from './styles.module.css'
import React from 'react'
import ChatTabs from './ChatTabs'
import ChatWindow from './ChatWindow'
import { Col, Row } from 'react-bootstrap'
import { PlayerType } from '../../../models/Player.model'

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
        if (type === PlayerType.DM) {
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
        <Row className={`justify-content-center ${styles.container}`}>
            <Col sm={3}>
                <ChatTabs users={generateUserTabs()} general={generateGeneralTabs()} switchActive={switchActive} />
            </Col>
            <Col>
                <ChatWindow
                    messages={messages[activeChat].messages}
                    username={username}
                    playername={playername}
                    activeChat={activeChat}
                    rid={rid}
                />
            </Col>
        </Row>
    )
}

export default Chat
