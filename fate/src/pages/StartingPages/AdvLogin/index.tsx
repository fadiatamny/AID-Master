import styles from '../StartingPages.module.css'
import AdvCircle from '../../../assets/images/CircleAdventurer.png'
import { useState } from 'react'
import Header from '../../../components/Header/Header'
import Input from '../../../components/Input/Input'
import EventsManager from '../../../services/EventsManager'
import { SocketEvents } from '../../../models/SocketEvents.model'

const AdvLoginScreen = (props: any) => {
    const [roomNumber, setRoomNumber] = useState('')
    const [username, setUsername] = useState('')
    const [playerName, setPlayerName] = useState('')
    const eventsManager = EventsManager.instance

    

    const handleSubmit = () => {
        eventsManager.on(SocketEvents.ROOM_JOINED, 'home-screen', (obj: any) => {
            console.log('lol')
            localStorage.setItem('rid',`${roomNumber}`)
            localStorage.setItem('playerName', `${playerName}`)
            localStorage.setItem('username', `${username}`)
            localStorage.setItem('type', obj.type)
            props.history.push(`/game`)
        })
        eventsManager.trigger(SocketEvents.JOIN_ROOM, {
            id: roomNumber,
            userId: 'blablabla',
            data: { type: 'player', id: 'blablabla', username: username }
        })
    }

    const handleRoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomNumber(event.target.value)
    }

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlayerName(event.target.value)
    }

    return (
        <div>
            <Header />
            <div className={`row ${styles.container}`}>
                <div className="col">
                    <img src={AdvCircle} className={styles.roundImage} />
                </div>
                <div className="col">
                    <Input
                        id="AdvUsername"
                        className={styles.advRoomCode}
                        label="Character Name"
                        placeholder="Smitten the Unbreakable"
                        onChange={handleUsernameChange}
                    />
                    <Input
                        id="AdvName"
                        className={styles.advRoomCode}
                        label="Your Name"
                        placeholder="Blake Holt"
                        onChange={handleNameChange}
                    />
                    <Input
                        id="AdvRoomEnter"
                        className={styles.advRoomCode}
                        submitLabel="Enter Room"
                        placeholder="Enter room number"
                        onChange={handleRoomChange}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    )
}

export default AdvLoginScreen
