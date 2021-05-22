import styles from './styles.module.css'
import React from 'react'
import ChatTabs from './ChatTabs'
import EventsManager, { SocketEvent } from '../../../services/EventsManager'
import ChatWindow from './ChatWindow'

const Chat = () => {
    const [activeChat, setActiveChat] = React.useState('All')
    const mockDataMessages = [
        {
            username: 'Smittens the Unbroken',
            playerName: 'Blake Holt',
            messageText:
                'He removes his tall black hat to reveal a balding pate. “I apologize for disturbing you,” he says in a deep, monotone voice. “I assume you are adventurers for hire, and I seek your expertise for a small matter.”',
            myMessage: false
        },
        {
            username: 'DM',
            playerName: 'Kyra Warner',
            messageText:
                "This character is much like the Master Villain of the same name, but he's not in charge of all this villainy, and he's definitely an enemy of one of the player-characters. You'll have to decide who he is and why he hates one of the heroes; he could be anything from a recurring villain to someone who simply lost a fight to the hero once.",
            myMessage: true
        },
        {
            username: 'Zor Fallwanderer',
            playerName: 'Tara Jackson',
            messageText:
                'This can occur in either the shop of the master craftsman of a palace or manor, or the guild-area of a city.',
            myMessage: false
        },
        {
            username: 'Smitters the Unbroken',
            playerName: 'Blake Holter',
            messageText:
                'He may alert the enemy when the heroes are planning a raid; he may steal the artifact and take it to the villain; he may stab a hero or important NPC in the back (literally) before departing.',
            myMessage: false
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

    React.useEffect(() => {
        EventsManager.instance.on(SocketEvent.MESSAGE, 'Chat', () => {
            console.log('im here')
        })
    }, [])

    const switchActive = (name: string) => setActiveChat(name)

    return (
        <div className="container-fluid">
            <div className={`row justify-content-center ${styles.container}`}>
                <div className={`col-md-3 col-xl-2`}>
                    <ChatTabs users={generateChatTabs()} general={generateGeneralTabs()} switchActive={switchActive} />
                </div>
                <div className={`col-md-5 col-xl-6`}>
                    <ChatWindow data={mockDataMessages} activeChat={activeChat} />
                </div>
            </div>
        </div>
    )
}

export default Chat
