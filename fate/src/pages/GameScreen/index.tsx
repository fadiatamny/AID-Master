import styles from './styles.module.css'
import Header from '../../components/Header/Header'
import Chat from './Chat'
import EventsManager, { SocketEvent } from '../../services/EventsManager'
import { useEffect } from 'react'

// export interface GameScreenProps{}

const GameScreen = () => {
    const eventsManager = EventsManager.instance

    const connected = () => {
        console.log('GameScreen: connected')
    }
    useEffect(() => {
        eventsManager.on(SocketEvent.CONNECTED, 'game-screen', connected)
        eventsManager.on(SocketEvent.HELLO, 'game-screen', () => console.log('HELLOooo'))
        eventsManager.trigger(SocketEvent.HI, {})
    }, [])

    return (
        <div>
            <Header />
            <div className={`${styles.container}`}>
                <Chat />
            </div>
        </div>
    )
}

export default GameScreen
