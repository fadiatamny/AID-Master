/* eslint-disable @typescript-eslint/no-this-alias */
import styles from './styles.module.css'
import Header from '../../components/Header/Header'
import Chat from './Chat'
import { useEffect, useState, useRef } from 'react'
import { SocketEvents } from '../../models/SocketEvents.model'
import EventsManager from '../../services/EventsManager'
import { generate } from '../../services/ScenarioGuide'

// export interface GameScreenProps{}

type MessageType = {
    username: string
    playername: string
    messageText: string
    myMessage: boolean
}

const GameScreen = () => {
    const eventsManager = EventsManager.instance
    const uid = localStorage.getItem('userId')
    const username = sessionStorage.getItem('username')
    const playername = sessionStorage.getItem('playername')
    const playertype = sessionStorage.getItem('type')
    const [roomid, setRoomid] = useState(sessionStorage.getItem('rid')!)

    const generateMessages = () => {
        const messagesObj: { [key: string]: { playername: string; messages: MessageType[] } } = {
            ['All']: {
                playername: 'Game Chat',
                messages:
                    playertype === 'dm'
                        ? [
                              {
                                  username: 'AID Master',
                                  playername: 'Help',
                                  messageText: `Welcome to the AID Master Game chat ${username}`,
                                  myMessage: false
                              },
                              {
                                  username: 'AID Master',
                                  playername: 'Help',
                                  messageText: `Invite other player using code\t${roomid}`,
                                  myMessage: false
                              }
                          ]
                        : []
            },
            ['AID Master']: {
                playername: 'Help',
                messages: []
            }
        }

        const playerlist = JSON.parse(sessionStorage.getItem('playerlist') ?? '[]')
        playerlist.map((p: { id: string; username: string; playername: string }) => {
            if (p.id !== uid && !messagesObj[p.username]) {
                messagesObj[p.username] = {
                    playername: p.playername ?? p.username,
                    messages: []
                }
            }
        })

        return messagesObj
    }

    const [messages, setMessages] = useState<{ [key: string]: { playername: string; messages: MessageType[] } }>(
        generateMessages()
    )
    const messagesRef = useRef<{ [key: string]: { playername: string; messages: MessageType[] } }>()
    messagesRef.current = messages

    const handleMessages = (obj: any) => {
        if (obj.target && obj.target !== username && obj.username !== username) {
            return
        }

        const messagesCopy = Object.assign({}, messagesRef.current)
        const id = !obj.target ? 'All' : obj.username === username ? obj.target ?? 'All' : obj.username

        if (!messagesCopy[id]) {
            messagesCopy[id] = {
                playername: obj.playername,
                messages: []
            }
        }
        messagesCopy[id].messages.push({
            username: obj.username,
            playername: obj.playername,
            messageText: obj.message,
            myMessage: obj.username === username
        })

        setMessages(messagesCopy)
    }

    const handleScenario = (obj: any) => {
        const messagesCopy = Object.assign({}, messages)
        messagesCopy['AID Master'].messages.push({
            username: 'AID Master',
            playername: 'Help',
            messageText: `loading scenario guide for:\n "${obj.message}"`,
            myMessage: false
        })
        setMessages(messagesCopy)
    }

    const handleScenarioGuide = (obj: any) => {
        const message = generate(obj.organized)
        const object = { username: 'AID Master', playername: 'Help', messageText: message, myMessage: false }

        // PRETTIFY % FROM MODEL
        const js = {
            username: 'AID Master',
            playername: 'Help',
            messageText: JSON.stringify(obj.organized),
            myMessage: false
        }
        let prettyText = ''
        Object.keys(obj.organized).map((key: string) => {
            const no = obj.organized[key]
            prettyText = prettyText + `${key}‏‏‎ ‎‎‎‎‎‎‎‎‎‎‎‎`
            no.map((key: Object) => {
                for (const [k, v] of Object.entries(key)) {
                    prettyText = prettyText + `${k} : ${v * 100} %    ‏‏‎‎`
                }
            })
        })
        js.messageText = prettyText
        //@ts-ignore
        setMessages((messages) => [...messages, object, js])
    }

    const handlePlayerJoined = (obj: any) => {
        const messagesCopy = Object.assign({}, messagesRef.current)
        if (obj.id !== uid) {
            const playerlist = sessionStorage.getItem('playerlist') ?? '[]'
            sessionStorage.setItem('playerlist', JSON.stringify([...JSON.parse(playerlist), obj]))

            if (!messagesCopy[obj.username]) {
                messagesCopy[obj.username] = {
                    playername: obj.playername,
                    messages: []
                }
            }
        }
        messagesCopy['All'].messages.push({
            username: 'AID Master',
            playername: 'System',
            messageText: `Welcome to the AID Master Game chat ${obj.username}`,
            myMessage: false
        })

        setMessages(messagesCopy)
    }

    useEffect(() => {
        eventsManager.on(SocketEvents.MESSAGE, 'game-component', (obj: any) => handleMessages(obj))
        eventsManager.on(SocketEvents.PLAYER_JOINED, 'game-component', (obj: any) => handlePlayerJoined(obj))
        if (sessionStorage.getItem('type') === 'dm') {
            eventsManager.on(SocketEvents.SCENARIO, 'game-componment', (obj: any) => handleScenario(obj))
            eventsManager.on(SocketEvents.SCENARIO_GUIDE, 'game-componment', (obj: any) => handleScenarioGuide(obj))
        }
    }, [])

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
                    playername={sessionStorage.getItem('playername')}
                    //@ts-ignore
                    type={sessionStorage.getItem('type')}
                />
            </div>
        </div>
    )
}

export default GameScreen
