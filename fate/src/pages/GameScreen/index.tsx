/* eslint-disable @typescript-eslint/no-this-alias */
import styles from './styles.module.css'
import Header from '../../components/Header/Header'
import Chat from './Chat'
import { useEffect, useState } from 'react'
import { SocketEvents } from '../../models/SocketEvents.model'
import EventsManager from '../../services/EventsManager'
import { generate } from '../../services/ScenarioGuide'

// export interface GameScreenProps{}

type MessageType = {
    username: string
    playerName: string
    messageText: string
    myMessage: boolean
}

const GameScreen = () => {
    const username = sessionStorage.getItem('username')
    const playername = sessionStorage.getItem('playerName')

    const [roomid, setRoomid] = useState('')
    const [messages, setMessages] = useState<{ [key: string]: MessageType[] }>({})
    const eventsManager = EventsManager.instance
    const connected = () => {
        console.log('connected')
    }

    const handleMessages = (obj: any) => {
        if (obj.target && obj.target.username !== username && obj.username !== username) {
            return
        }

        const messagesCopy = Object.assign({}, messages)
        const id = !obj.target ? '*' : obj.username === username ? obj.target.username ?? '*' : obj.username

        if (!messagesCopy[id]) {
            messagesCopy[id] = []
        }
        messagesCopy[id].push({
            username: obj.username,
            playerName: obj.username,
            messageText: obj.message,
            myMessage: obj.username === username
        })

        setMessages((messages) => Object.assign({}, messages, messagesCopy))
    }

    const handleScenario = (obj: any) => {
        const mess = `loading scenario guide for:\n "${obj.message}"`
        const messagesCopy = Object.assign({}, messages)
        const id = 'AID Master'

        if (!messagesCopy[id]) {
            messagesCopy[id] = []
        }
        messagesCopy[id].push({
            username: 'AID Master',
            playerName: 'Help',
            messageText: `loading scenario guide for:\n "${obj.message}"`,
            myMessage: false
        })

        setMessages((messages) => Object.assign({}, messages, messagesCopy))
    }

    const handleScenarioGuide = (obj: any) => {
        const message = generate(obj.organized)
        const object = { username: 'AID Master', playerName: 'Help', messageText: message, myMessage: false }
        // PRETTIFY % FROM MODEL
        const js = {
            username: 'AID Master',
            playerName: 'Help',
            messageText: JSON.stringify(obj.organized),
            myMessage: false
        }
        let prettyText = ''
        Object.keys(obj.organized).map((key: string) => {
            const no = obj.organized[key]
            prettyText = prettyText + `${key}‏‏‎ ‎‎‎‎‎‎‎‎‎‎‎‎`
            no.map((key: object) => {
                for (const [k, v] of Object.entries(key)) {
                    prettyText = prettyText + `${k} : ${v * 100} %    ‏‏‎‎`
                }
            })
        })
        js.messageText = prettyText
        //@ts-ignore
        setMessages((messages) => [...messages, object, js])
    }

    const sendRoomMessage = () => {
        if (!roomid) {
            return
        }

        if (sessionStorage.getItem('type') === 'dm') {
            eventsManager.trigger(SocketEvents.MESSAGE, {
                username: 'Game Bot',
                message: `Invite other player using code\t${roomid}`,
                target: { username, playername },
                playername: 'System'
            })
        } else {
            eventsManager.trigger(SocketEvents.MESSAGE, {
                username: 'Game Bot',
                message: `${sessionStorage.getItem('username')} has joined the chat`,
                playername: 'System'
            })
        }
    }

    const handlePlayerJoined = (obj: any) => {
        const playerlist = sessionStorage.getItem('playerlist') ?? '[]'
        sessionStorage.setItem('playerlist', JSON.stringify([...JSON.parse(playerlist), obj]))
    }

    useEffect(() => {
        eventsManager.on(SocketEvents.MESSAGE, 'game-component', (obj: any) => handleMessages(obj))
        eventsManager.on(SocketEvents.CONNECTED, 'game-screen', () => connected())
        eventsManager.on(SocketEvents.PLAYER_JOINED, 'game-component', (obj: any) => handlePlayerJoined(obj))
        if (sessionStorage.getItem('type') === 'dm') {
            eventsManager.on(SocketEvents.SCENARIO, 'game-componment', (obj: any) => handleScenario(obj))
            eventsManager.on(SocketEvents.SCENARIO_GUIDE, 'game-componment', (obj: any) => handleScenarioGuide(obj))
        }
        //@ts-ignore
        setRoomid(sessionStorage.getItem('rid'))
    }, [])

    useEffect(() => {
        sendRoomMessage()
    }, [roomid])

    useEffect(
        () => () => {
            eventsManager.trigger(SocketEvents.LEAVE_ROOM, {
                id: sessionStorage.getItem('rid'),
                userId: localStorage.getItem('userId'),
                username: sessionStorage.getItem('username')
            })
            eventsManager.off(SocketEvents.MESSAGE, 'game-component')
            eventsManager.off(SocketEvents.CONNECTED, 'game-screen')
            eventsManager.off(SocketEvents.SCENARIO, 'game-componment')
            eventsManager.off(SocketEvents.SCENARIO_GUIDE, 'game-componment')
        },
        []
    )

    return (
        <div>
            <Header />
            <div className={`${styles.container}`}>
                {/*@ts-ignore*/}
                <Chat
                    messages={messages}
                    rid={roomid}
                    //@ts-ignore
                    username={sessionStorage.getItem('username')}
                    //@ts-ignore
                    playerName={sessionStorage.getItem('playerName')}
                    //@ts-ignore
                    type={sessionStorage.getItem('type')}
                />
            </div>
        </div>
    )
}

export default GameScreen
