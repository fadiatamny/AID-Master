import React from 'react'
import queryString from 'query-string'
import { io } from 'socket.io-client'

import styles from './Chat.module.css'
import InfoBar from '../InfoBar/InfoBar'
import Messages from '../Messages/Messages'

const ENDPOINT = 'localhost:5069'

export interface IChatProps {
    roomId: string
    username: string
    location: any
}

export default function Chat({ location }: IChatProps) {
    const [username, setUsername] = React.useState('')
    const [roomId, setRoomId] = React.useState('')
    const [users, setUsers] = React.useState<string[]>([])
    const [message, setMessage] = React.useState('')
    const [messages, setMessages] = React.useState<any[]>([])
    const socket = io(ENDPOINT, { withCredentials: true })
    const [dm, setDm] = React.useState(false)
    const [scenario, setScenario] = React.useState('')

    socket.on('roomCreated', (id: string) => {
        const { name } = queryString.parse(location.search)
        setDm(true)
        setRoomId(id)
        console.log('users ', users)
        // @ts-ignore
        setUsers((users) => [...users, name])
        setMessages((messages) => [...messages, { name: 'admin', message: `room id: ${id}` }])
    })

    socket.on('message', (username: string, message: string, target?: string) => {
        setMessages((messages) => [...messages, { name: username, message }])
    })

    socket.on('joinedRoom', (username: string) => {
        setUsers((users) => [...users, username])
    })

    socket.on('scenarioGuide', (username: string, data: string) => {
        console.log('DATA ', JSON.parse(data))
        alert(data)
        setScenario(data)
    })

    React.useEffect(() => {
        const { name, room } = queryString.parse(location.search)
        // @ts-ignore
        setUsername(name)
        // @ts-ignore
        setRoomId(room)

        if (room) socket.emit('joinRoom', room, username)
        else socket.emit('createRoom')
    }, [])

    const sendMessage = () => {
        // e.preventDefault();
        if (message) {
            console.log('user', username)
            socket.emit('sendMessage', roomId, username, message)
        }
    }

    const sendScenario = () => {
        socket.emit('sendSenario', roomId, username, message)
    }

    return dm ? (
        <div className={styles.outerContainer}>
            <div className={styles.container}>
                <InfoBar room={roomId ?? 'waiting for room'} />
                <Messages name={username} messages={messages}></Messages>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyPress={(event) => (event.key === 'Enter' ? sendMessage() : null)}
                />
                <button className="sendButton" onClick={sendMessage}>
                    Send Chat
                </button>
                <button onClick={sendScenario}>Send Game Scenario</button>
                <div>
                    <p className={styles.guide}>{scenario}</p>
                </div>
            </div>
        </div>
    ) : (
        <div className={styles.outerContainer}>
            <div className={styles.container}>
                <InfoBar room={roomId ?? 'waiting for room'} />
                <Messages name={username} messages={messages}></Messages>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyPress={(event) => (event.key === 'Enter' ? sendMessage() : null)}
                />
                <button className="sendButton" onClick={sendMessage}>
                    Send
                </button>{' '}
            </div>
        </div>
    )
}
