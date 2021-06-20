import styles from './styles.module.css'
import Header from '../../components/Header/Header'
import Chat from './Chat'
import { useEffect, useState, useRef } from 'react'
import { SocketEvents } from '../../models/SocketEvents.model'
import EventsManager from '../../services/EventsManager'
import { generate } from '../../services/ScenarioGuide'
// import CharacterSheet from './CharacterSheets/CharacterSheet'
import { Col, Container, Row } from 'react-bootstrap'
import { CharacterSheet as CH } from '../../models/CharacterSheet.model'
import Button from '../../components/Button/Button'
import CharacterSheets from './CharacterSheets'

type MessageType = {
    username: string
    playername: string
    messageText: string | string[]
    myMessage: boolean
}
const mocksheet = {
    name: 'Kyrren',
    abilities: ['born alive'],
    equipment: ['sword'],
    level: 2,
    life: { current: 54, max: 100 },
    mana: { current: 70, max: 70 },
    shield: { current: 24, max: 30 },
    imageurl: 'https://images.theconversation.com/files/366179/original/file-20201028-15-1g9o7at.jpg'
}

const mocksheet2 = {
    name: 'Smittens',
    abilities: ['born alive'],
    equipment: ['sword'],
    level: 2,
    life: { current: 54, max: 100 },
    mana: { current: 70, max: 70 },
    shield: { current: 24, max: 30 },
    imageurl: 'https://static3.bigstockphoto.com/4/4/2/large1500/244707958.jpg'
}

const GameScreen = () => {
    const eventsManager = EventsManager.instance
    const uid = localStorage.getItem('userId')
    const username = sessionStorage.getItem('username')
    const playertype = sessionStorage.getItem('type')
    const playername = sessionStorage.getItem('playername')
    const roomid = sessionStorage.getItem('rid')
    const [sheets, setSheets] = useState<CH[]>([mocksheet, mocksheet2])
    const [showsheet, setShowsheet] = useState(true)

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
        const messagesCopy = Object.assign({}, messagesRef.current)
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
        const messagesCopy = Object.assign({}, messagesRef.current)
        messagesCopy['AID Master'].messages.push(
            {
                username: 'AID Master',
                playername: 'Help',
                messageText: message,
                myMessage: false
            },
            {
                username: 'AID Master',
                playername: 'Help',
                messageText: prettyText,
                myMessage: false
            }
        )
        setMessages(messagesCopy)
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

    const toggleSheets = () => {
        setShowsheet(!showsheet)
    }

    useEffect(() => {
        //check state
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
        <>
            <Header />
            <Container fluid>
                <Row>
                    <Col sm={showsheet ? { span: 4 } : { span: 1 }}>
                        {showsheet ? (
                            sheets.length === 0 ? (
                                <Row>
                                    <Col>
                                        <Button onClick={toggleSheets}>
                                            <p>No Sheets</p>
                                        </Button>
                                    </Col>
                                </Row>
                            ) : (
                                <CharacterSheets sheets={sheets} toggleSheets={toggleSheets} type={playertype} />
                            )
                        ) : (
                            <Row>
                                <Col>
                                    <Button onClick={toggleSheets}>
                                        <p>Show Sheets</p>
                                    </Button>
                                </Col>
                            </Row>
                        )}
                    </Col>
                    <Col>
                        <Chat
                            messages={messages}
                            rid={roomid!}
                            username={username!}
                            playername={playername!}
                            type={playertype!}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default GameScreen
