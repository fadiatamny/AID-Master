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

const globalMessages:any[] = []

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
        console.log('GameScreen: connected')
    }

    console.log('Loading page')

    const handleMessages = (obj: any) => {
        const object: MessageType = {
            username: obj.username,
            playerName: obj.username == 'DM' ? 'Kyra Warner' : 'Blake Holt',
            messageText: obj.message,
            myMessage: obj.username == 'DM' ? true : false
        }
        console.log('Recieving message:', messages)
        const tmp = [...messages, object]
        globalMessages.push(object)
        console.log('Tmp after messages', tmp)
        // @ts-ignore
        setMessages(messages => [...messages, {
            username: obj.username,
            playerName: obj.username == 'DM' ? 'Kyra Warner' : 'Blake Holt',
            messageText: obj.message,
            myMessage: obj.username == 'DM' ? true : false
        }])
    }

    useEffect(() => {
        eventsManager.on(SocketEvents.MESSAGE, 'game-component', (obj: any) => handleMessages(obj))
        eventsManager.on(SocketEvents.CONNECTED, 'game-screen', (obj: any) => connected())
        eventsManager.on(SocketEvents.SCENARIO, 'game-componment', (obj: any) => {
            // console.log(obj)
            const object = { username: 'AID Master', playerName: 'Help', messageText: obj.message, myMessage: false }
            const tmp = [...messages, object]
            //setMessages(tmp)
        })
        eventsManager.on(SocketEvents.SCENARIO_GUIDE, 'game-componment', (obj: any) => {
            console.log(obj.organized)
            const message = generate(obj.organized)
            // console.log(message)
            const object = { username: 'AID Master', playerName: 'Help', messageText: message, myMessage: false }
            // PRETTIFY THIS USING A CODEBLOCK ELEMENT
            const js = {
                username: 'AID Master',
                playerName: 'Help',
                messageText: JSON.stringify(obj.organized),
                myMessage: false
            }
            let prettyText = ''
            Object.keys(obj.organized).map((key: string) => {
                const no = obj.organized[key]
                prettyText = prettyText + `${key} \n `
                no.map((key: object) => {
                    for (const [k, v] of Object.entries(key)) {
                        prettyText = prettyText + `${k} : ${v * 100} % \n`
                    }
                })
            })
            js.messageText = prettyText
            const tmp = [...messages, object, js]
            //setMessages(tmp)
        })
        //get room id from url
        const { rid } = queryString.parse(location.search)
        //@ts-ignore
        setRoomid(rid)
        // // console.log(rid)
        // eventsManager.trigger(SocketEvents.SEND_SCENARIO, {
        //     id: rid,
        //     username: 'DM',
        //     message: `If the goblins are alerted, they shoot through the holes at anyone in the passageway between their wall and the cave entrance. Treat the holes as arrow slits, giving the goblins three-quarters cover.`
        // })
    }, [])

    // useEffect(() => {
    //         eventsManager.trigger(SocketEvents.SEND_MESSAGE, {
    //             id: roomid,
    //             username: 'DM',
    //             message: 'hello'
    //         })
    //         eventsManager.trigger(SocketEvents.SEND_SCENARIO, {
    //             id: roomid,
    //             username: 'DM',
    //             message: `room id is: ${roomid}`
    //         })

    // }, [messages])

    // eventsManager.trigger(SocketEvents.SEND_MESSAGE, {
    //     id: rid,
    //     username: 'DM',
    //     message: 'hello'
    // })
    // eventsManager.trigger(SocketEvents.SEND_SCENARIO, {
    //     id: rid,
    //     username: 'DM',
    //     message: `If the goblins are alerted, they shoot through the holes at anyone in the passageway between their wall and the cave entrance. Treat the holes as arrow slits, giving the goblins three-quarters cover.`
    // })

    return (
        <div>
            <Header />
            <div className={`${styles.container}`}>
                <Chat messages={messages} rid={roomid} />
            </div>
        </div>
    )
}

export default GameScreen
