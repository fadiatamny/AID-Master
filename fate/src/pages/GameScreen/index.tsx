/* eslint-disable @typescript-eslint/no-this-alias */
import styles from './styles.module.css'
import Header from '../../components/Header/Header'
import Chat from './Chat'
import { useEffect, useState } from 'react'
import { SocketEvents } from '../../models/SocketEvents.model'
import EventsManager from '../../services/EventsManager'
import queryString from 'query-string'
import { generate } from '../../services/ScenarioGuide'

// export interface GameScreenProps{}

const globalMessages: any[] = []

type MessageType = {
    username: string
    playerName: string
    messageText: string
    myMessage: boolean
}

const GameScreen = ({ location }: any) => {
    const [roomid, setRoomid] = useState('')
    const [messages, setMessages] = useState<MessageType[]>([])
    const eventsManager = EventsManager.instance
    const connected = () => {
        console.log('connected')
    }

    const handleMessages = (obj: any) => {
        // console.log('obj username ' + obj.username)
        // console.log('state uname ' + uname)
        let myMessage: boolean
        if (obj.username === localStorage.getItem('username')) myMessage = true
        else myMessage = false
        const object: MessageType = {
            username: obj.username,
            playerName: obj.username,
            messageText: obj.message,
            myMessage: myMessage
        }
        globalMessages.push(object)
        // @ts-ignore
        setMessages((messages) => [
            ...messages,
            {
                username: obj.username,
                playerName: obj.username,
                messageText: obj.message,
                myMessage: myMessage
            }
        ])
    }

    const handleScenario = (obj: any) => {
        const object = { username: 'AID Master', playerName: 'Help', messageText: obj.message, myMessage: false }
        setMessages([...messages, object])
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
                    prettyText = prettyText + `${k} : ${v * 100} %‏‏‎‎`
                }
            })
        })
        js.messageText = prettyText
        setMessages([...messages, object, js])
    }

    const sendRoomMessage = () => {
        eventsManager.trigger(SocketEvents.SEND_MESSAGE, {
            id: roomid,
            username: 'Game Bot',
            message: `Invite other player using code          ${roomid}`,
            target: { username: localStorage.getItem('username'), playername: localStorage.getItem('playerName') }
        })
    }

    useEffect(() => {
        eventsManager.on(SocketEvents.MESSAGE, 'game-component', (obj: any) => handleMessages(obj))
        eventsManager.on(SocketEvents.CONNECTED, 'game-screen', () => connected())
        eventsManager.on(SocketEvents.SCENARIO, 'game-componment', (obj: any) => handleScenario(obj))
        eventsManager.on(SocketEvents.SCENARIO_GUIDE, 'game-componment', (obj: any) => handleScenarioGuide(obj))
        //@ts-ignore
        setRoomid(localStorage.getItem('rid'))
        // const tmpun = localStorage.getItem('username')
        // //@ts-ignore
        // setUname(tmpun)
        // // console.log('local: ' + localStorage.getItem('username') + ' state: ' + uname)
        // //@ts-ignore
        // setPname(localStorage.getItem('playerName'))
        // //@ts-ignore
        // setPtype(localStorage.getItem('type'))
    }, [])

    useEffect(() => {
        sendRoomMessage()
    }, [roomid])

    return (
        <div>
            <Header />
            <div className={`${styles.container}`}>
                {/*@ts-ignore*/}
                <Chat
                    messages={messages}
                    rid={roomid}
                    //@ts-ignore
                    username={localStorage.getItem('username')}
                    //@ts-ignore
                    playerName={localStorage.getItem('playerName')}
                    //@ts-ignore
                    type={localStorage.getItem('type')}
                />
            </div>
        </div>
    )
}

export default GameScreen
