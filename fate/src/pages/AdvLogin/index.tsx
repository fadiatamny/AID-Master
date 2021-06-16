import styles from '../StartingPages.module.css'
import AdvCircle from '../../assets/images/CircleAdventurer.png'
import { useState } from 'react'
import Header from '../../components/Header/Header'
import Input from '../../components/Input/Input'
import EventsManager from '../../services/EventsManager'
import { SocketEvents } from '../../models/SocketEvents.model'
import { Col, Row } from 'react-bootstrap'

const AdvLoginScreen = (props: any) => {
    const [roomNumber, setRoomNumber] = useState('')
    const [username, setUsername] = useState('')
    const [playername, setPlayername] = useState('')
    const eventsManager = EventsManager.instance
    const uid = localStorage.getItem('userId')

    const handleSubmit = () => {
        eventsManager.on(SocketEvents.ROOM_JOINED, 'home-screen', (obj: any) => {
            sessionStorage.setItem('rid', `${roomNumber}`)
            sessionStorage.setItem('playername', `${playername}`)
            sessionStorage.setItem('username', `${username}`)
            sessionStorage.setItem('type', obj.type)
            sessionStorage.setItem('playerlist', JSON.stringify(obj.playerlist))
            sessionStorage.setItem('sheet', JSON.stringify(obj.CharacterSheet))
            props.history.push(`/game`)
        })
        eventsManager.on(SocketEvents.NEW_PLAYER, 'home-screen', (obj: any) => {
            // means you are a new player and have to create stuff 
            alert(JSON.stringify(obj))

            // after we handle the form of creating his character sheet and all we send the following 
            eventsManager.trigger(SocketEvents.NEW_PLAYER_REGISTER, {
                roomId: roomNumber,
                data: { type: 'player', id: uid, username: username, playername: playername }
            })

            //after you trigger that yo uwait for the join room event
        })
        eventsManager.trigger(SocketEvents.JOIN_ROOM, {
            id: roomNumber,
            userId: localStorage.getItem('userId'),
            data: { type: 'player', id: uid, username: username, playername: playername }
        })
    }

    const handleRoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomNumber(event.target.value)
    }

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlayername(event.target.value)
    }

    return (
        <>
            <Header />
            <Row className={`${styles.container}`}>
                <Col>
                    <img src={AdvCircle} className={styles.roundImage} />
                </Col>
                <Col>
                    <Input
                        id="AdvUsername"
                        className={styles.RoomCode}
                        label="Character Name"
                        placeholder="Smitten the Unbreakable"
                        onChange={handleUsernameChange}
                    />
                    <Input
                        id="AdvName"
                        className={styles.RoomCode}
                        label="Your Name"
                        placeholder="Blake Holt"
                        onChange={handleNameChange}
                    />
                    <Input
                        id="AdvRoomEnter"
                        className={styles.RoomCode}
                        submitLabel="Enter Room"
                        placeholder="Enter room number"
                        onChange={handleRoomChange}
                        onSubmit={handleSubmit}
                    />
                </Col>
            </Row>
        </>
    )
}

export default AdvLoginScreen
