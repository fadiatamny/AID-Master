import './styles.css'
import styles from './styles.module.css'
import AdvCircle from '../../assets/images/CircleAdventurer.png'
import { useState, useRef } from 'react'
import Header from '../../components/Header'
import Input from '../../components/Input'
import EventsManager from '../../services/EventsManager'
import { SocketEvents } from '../../models/SocketEvents.model'
import { Col, Row, Modal } from 'react-bootstrap'
import { PlayerType } from '../../models/Player.model'
import CharacterSheet from '../../components/CharacterSheet'
import { CharacterSheet as ICharacterSheet } from '../../models/CharacterSheet.model'
import { NotificationManager } from 'react-notifications'
import { History } from 'history'

interface AdventureLoginScreenProps {
    history: History
}

const AdventureLoginScreen = ({ history }: AdventureLoginScreenProps) => {
    const [roomNumber, setRoomNumber] = useState('')
    const [username, setUsername] = useState('')
    const [playername, setPlayername] = useState('')
    const eventsManager = EventsManager.instance
    const uid = localStorage.getItem('userId')
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleModalShow = () => setShow(true)
    const showRef = useRef(show)
    showRef.current = show
    const playernameRef = useRef(playername)
    playernameRef.current = playername
    const handleSubmit = () => {
        if (roomNumber === '' || username === '' || playername === '') {
            let message = ''
            if (username === '') {
                message = 'Username must be filled'
            }
            if (playername === '') {
                if (message === '') {
                    message = 'Playername must be filled'
                } else {
                    message = 'Empty fields must be filled'
                }
            }
            if (roomNumber === '') {
                if (message === '') {
                    message = 'Room number must be filled'
                } else {
                    message = 'Empty fields must be filled'
                }
            }

            NotificationManager.error('Error Occured', message)
            return
        }

        eventsManager.on(SocketEvents.ROOM_JOINED, 'home-screen', (obj: any) => {
            sessionStorage.setItem('rid', `${roomNumber}`)
            sessionStorage.setItem('playername', `${playername}`)
            sessionStorage.setItem('username', `${username}`)
            sessionStorage.setItem('type', obj.type)
            sessionStorage.setItem('playerlist', JSON.stringify(obj.playerlist))
            sessionStorage.setItem('sheet', JSON.stringify(obj.CharacterSheet))
            history.push(`/game`)
        })

        eventsManager.on(SocketEvents.NEW_PLAYER, 'home-screen', (obj: any) => {
            if (obj.id !== uid) return
            handleModalShow()
        })

        eventsManager.trigger(SocketEvents.JOIN_ROOM, {
            id: roomNumber,
            userId: localStorage.getItem('userId'),
            data: { type: 'player', id: uid, username: username, playername: playername }
        })
    }

    const newPlayerSubmit = (sheet: ICharacterSheet) => {
        eventsManager.trigger(SocketEvents.NEW_PLAYER_REGISTER, {
            roomId: roomNumber,
            data: { type: PlayerType.PLAYER, id: uid, username, playername, characterSheet: sheet }
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

            <Modal show={showRef.current} onHide={handleClose} dialogClassName={styles.modalContainer}>
                <Modal.Header closeButton closeLabel="" className={styles.modalHeader}>
                    <Modal.Title>Character Info</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <CharacterSheet dm={false} submitForm={newPlayerSubmit} playername={playernameRef.current} />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AdventureLoginScreen
