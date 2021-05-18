import styles from './Chat.module.css'
import Message from '../../../components/Message/Message'
import User from '../../../components/User/User'
import { useState } from 'react'

const Chat = () => {
    const [activeChat, setActiveChat] = useState('All')
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
            username: 'Smittens the Unbroken',
            playerName: 'Blake Holt',
            messageText:
                'He may alert the enemy when the heroes are planning a raid; he may steal the artifact and take it to the villain; he may stab a hero or important NPC in the back (literally) before departing.',
            myMessage: false
        }
    ]

    const mockDataUsers = [
        { username: 'All', playerName: 'All' },
        { username: 'AID Master', playerName: 'Suggestion Time!' },
        { username: 'Smittens the Unbroken', playerName: 'Blake Holt' },
        { username: 'Zor Fallwanderer', playerName: 'Tara Jackson' }
    ]

    return (
        <div className="container-fluid h-100">
            <div className="row justify-content-center h-100">
                <div className={`col-md-4 col-xl-3 ${styles.chat}`}>
                    <div className={`${styles.card} mb-sm-3 mb-md-0 contacts_card`}>
                        <div className={styles.cardheader}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    name=""
                                    className={`form-control ${styles.search}`}
                                />
                                <div className="input-group-prepend">
                                    <span className={`input-group-text ${styles.search_btn}`}>
                                        <i className="fas fa-search"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={`card-body ${styles.contacts_body}`}>
                            <ul className={styles.contacts}>
                                {mockDataUsers.map((user, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className={user.username == activeChat ? styles.active : styles.nonactive}
                                        >
                                            <div
                                                onClick={() => {
                                                    setActiveChat(user.username)
                                                }}
                                            >
                                                <User username={user.username} playerName={user.playerName} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </ul>
                        </div>
                        <div className={styles.cardfooter}></div>
                    </div>
                </div>
                <div className={`col-md-8 col-xl-6 ${styles.chat}`}>
                    <div className={styles.card}>
                        <div className={`${styles.cardheader} ${styles.msg_head}`}>
                            <p>{activeChat}</p>
                        </div>
                        <div className={`card-body ${styles.msg_card_body}`}>
                            {mockDataMessages.map((message, i) => {
                                if (activeChat == 'All')
                                    return (
                                        <div key={i} className="mb-4">
                                            <Message
                                                username={message.username}
                                                playerName={message.playerName}
                                                messageText={message.messageText}
                                                myMessage={message.myMessage}
                                            />
                                        </div>
                                    )
                                else if (activeChat == message.username || message.username == 'DM')
                                    return (
                                        <div key={i} className="mb-4">
                                            <Message
                                                username={message.username}
                                                playerName={message.playerName}
                                                messageText={message.messageText}
                                                myMessage={message.myMessage}
                                            />
                                        </div>
                                    )
                            })}
                        </div>
                        <div className={styles.cardfooter}>
                            <div className="input-group">
                                <div className="input-group-append">
                                    <span className={`input-group-text ${styles.attach_btn}`}>
                                        <i className="fas fa-paperclip"></i>
                                    </span>
                                </div>
                                <textarea
                                    name=""
                                    className={`form-control ${styles.type_msg}`}
                                    placeholder="Type your message..."
                                ></textarea>
                                <div className="input-group-append">
                                    <span className={`input-group-text ${styles.send_btn}`}>
                                        <i className="fas fa-location-arrow"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat
