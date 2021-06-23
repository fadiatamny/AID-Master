import styles from './styles.module.css'
import DMCircle from '../../assets/images/CircleDM.png'
import { useState } from 'react'
import Header from '../../components/Header'
import Input from '../../components/Input'
import EventsManager from '../../services/EventsManager'
import { SocketEvents } from '../../models/SocketEvents.model'
import Clickable from '../../components/Clickable'
import { Row, Col } from 'react-bootstrap'

const DMLoginScreen = (props: any) => {
    const [username, setUsername] = useState('Game Master')
    const [playername, setPlayername] = useState('DM')
    const eventsManager = EventsManager.instance
    const uid = localStorage.getItem('userId')

    const handleSubmit = () => {
        eventsManager.on(SocketEvents.ROOM_CREATED, 'home-screen', ({ id }: any) => {
            sessionStorage.setItem('rid', `${id}`)
            sessionStorage.setItem('playername', `${playername}`)
            sessionStorage.setItem('username', `${username}`)
            sessionStorage.setItem('type', 'dm')
            sessionStorage.setItem('playerlist', JSON.stringify([{ id: uid, username, playername }]))
            props.history.push(`/game`)
        })
        eventsManager.trigger(SocketEvents.CREATE_ROOM, {
            id: uid,
            username,
            playername
        })
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
            <Row className={` ${styles.container}`}>
                <Col>
                    <img src={DMCircle} className={styles.roundImage} />
                </Col>
                <Col>
                    <Input
                        id="DMUsername"
                        className={styles.RoomCode}
                        label="Character Name"
                        placeholder="Dungeon Master"
                        onChange={handleUsernameChange}
                    />
                    <Input
                        id="DMName"
                        className={styles.RoomCode}
                        label="Your Name"
                        placeholder="Kyra Warner"
                        onChange={handleNameChange}
                    />

                    <Clickable onClick={handleSubmit}>
                        <p className={styles.submit}>Create Game</p>
                    </Clickable>
                </Col>
            </Row>
        </>
    )
}

export default DMLoginScreen
