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
        console.log('Adv')
    }

    const clickDM = () => {
        eventsManager.on(SocketEvents.ROOM_CREATED, 'home-screen', ({ id }: any) => {
            props.history.push(`/game?rid=${id}`)
        })
        eventsManager.trigger(SocketEvents.CREATE_ROOM, {playerId: 'blablablablabl', username:'bladvblaslblasdbfla'})
    }

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <Link to="/AdventurerLogin">
                    <img src={AdvCircle} className={styles.roundImage} onClick={clickAdv} />
                </Link>
                <img src={logo} alt="AID Master logo" className={styles.logo} />
                <Clickable onClick={clickDM}>
                    <img src={DMCircle} className={styles.roundImage} onClick={clickDM} />
                </Clickable>
            </div>
        </div>
    )
}

export default HomaPage
