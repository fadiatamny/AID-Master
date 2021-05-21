import styles from './GameScreen.module.css'
import Header from '../../components/Header/Header'
import Chat from './Chat'
import EventsManager, { SocketEvent } from '../../services/EventsManager'
import { useEffect } from 'react'

// export interface GameScreenProps{}

const GameScreen = () => {
    const eventsManager = EventsManager.instance

    const connected = () => {
        console.log('TEST: connected')
    }
    useEffect(() => {
        eventsManager.on(SocketEvent.CONNECT, 'game-screen', connected)
        eventsManager.trigger(SocketEvent.CONNECT, {})
    }, [])

    return (
        <div>
            <Header />
            <div className={`${styles.container} row`}>
                <Chat />
            </div>
        </div>
    )
}

export default GameScreen
