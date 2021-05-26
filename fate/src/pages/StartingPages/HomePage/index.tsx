import { Link } from 'react-router-dom'
import styles from '../StartingPages.module.css'
import logo from '../../../assets/images/Logo.png'
import AdvCircle from '../../../assets/images/CircleAdventurer.png'
import DMCircle from '../../../assets/images/CircleDM.png'
import Header from '../../../components/Header/Header'
import EventsManager from '../../../services/EventsManager'
import Clickable from '../../../components/Clickable/Clickable'
import { SocketEvents } from '../../../models/SocketEvents.model'

//@ts-ignore
const HomaPage = (props: any) => {
    const eventsManager = EventsManager.instance

    const clickAdv = () => {
        props.history.push(`/AdventurerLogin`)
    }

    const clickDM = () => {
        const playerName = "Game Master"
        const username = "DM"
        
        eventsManager.on(SocketEvents.ROOM_CREATED, 'home-screen', ({ id }: any) => {
            localStorage.setItem('rid',`${id}`)
            localStorage.setItem('playerName', `${playerName}`)
            localStorage.setItem('username', `${username}`)
            localStorage.setItem('type', 'dm')
            props.history.push(`/game`)
        })
        eventsManager.trigger(SocketEvents.CREATE_ROOM, { playerId: localStorage.getItem('userId'), username: username })
    }

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <Clickable onClick={clickAdv}>
                    <img src={AdvCircle} className={styles.roundImage} />
                </Clickable>
                <img src={logo} alt="AID Master logo" className={styles.logo} />
                <Clickable onClick={clickDM}>
                    <img src={DMCircle} className={styles.roundImage} />
                </Clickable>
            </div>
        </div>
    )
}

export default HomaPage
