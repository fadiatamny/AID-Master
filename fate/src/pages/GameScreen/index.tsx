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
    const username = localStorage.getItem('username')
    const playername = localStorage.getItem('playerName')

    const [roomid, setRoomid] = useState('')
    const [messages, setMessages] = useState<MessageType[]>([])
    const eventsManager = EventsManager.instance
    const connected = () => {
        console.log('connected')
    }

    const handleMessages = (obj: any) => {
        if (obj.target && obj.target.username !== username) {
            return
        }

        let myMessage: boolean
        if (obj.username === localStorage.getItem('username')) myMessage = true
        else myMessage = false

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
        const mess = `loading scenario guide for:\n "${obj.message}"`
        const object = { username: 'AID Master', playerName: 'Help', messageText: mess, myMessage: false }
        setMessages((messages) => [...messages, object])
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
        setMessages((messages) => [...messages, object, js])
    }

    const sendRoomMessage = () => {
        if (localStorage.getItem('type') === 'dm') {
            eventsManager.trigger(SocketEvents.SEND_MESSAGE, {
                id: roomid,
                username: 'Game Bot',
                message: `Invite other player using code\t${roomid}`,
                target: { username, playername }
            })
        } else {
            eventsManager.trigger(SocketEvents.SEND_MESSAGE, {
                id: roomid,
                username: 'Game Bot',
                message: `${localStorage.getItem('username')} has joined the chat`,
                target: { username, playername }
            })
        }
    }

    useEffect(() => {
        eventsManager.on(SocketEvents.MESSAGE, 'game-component', (obj: any) => handleMessages(obj))
        eventsManager.on(SocketEvents.CONNECTED, 'game-screen', () => connected())
        if (localStorage.getItem('type') === 'dm') {
            eventsManager.on(SocketEvents.SCENARIO, 'game-componment', (obj: any) => handleScenario(obj))
            eventsManager.on(SocketEvents.SCENARIO_GUIDE, 'game-componment', (obj: any) => handleScenarioGuide(obj))
        }
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

    useEffect(
        () => () => {
            eventsManager.trigger(SocketEvents.LEAVE_ROOM, {
                id: localStorage.getItem('rid'),
                userId: localStorage.getItem('userId')
            })
            // eventsManager.off(SocketEvents.MESSAGE, 'game-component')
            // eventsManager.off(SocketEvents.CONNECTED, 'game-screen')
            // eventsManager.off(SocketEvents.SCENARIO, 'game-componment')
            // eventsManager.off(SocketEvents.SCENARIO_GUIDE, 'game-componment')
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
