import styles from './styles.module.css'
import logo from '../../assets/images/Logo.png'
import AdvCircle from '../../assets/images/CircleAdventurer.png'
import DMCircle from '../../assets/images/CircleDM.png'
import Header from '../../components/Header'
import Clickable from '../../components/Clickable'
import { useEffect } from 'react'
import { History } from 'history'
import SocketManager from '../../services/SocketManager'

interface HomePageProps {
    history: History
}

const HomaPage = ({ history }: HomePageProps) => {
    const clickAdv = () => {
        history.push(`/AdventurerLogin`)
    }

    const clickDM = () => {
        history.push(`/DMLogin`)
    }

    useEffect(() => {
        SocketManager.newInstance()
        sessionStorage.removeItem('rid')
        sessionStorage.removeItem('playername')
        sessionStorage.removeItem('username')
        sessionStorage.removeItem('type')
        sessionStorage.removeItem('playerlist')
    }, [])

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
