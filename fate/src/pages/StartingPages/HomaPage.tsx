import { Link } from 'react-router-dom'
import styles from './StartingPages.module.css'
import logo from '../../assets/images/Logo.png'
import AdvCircle from '../../assets/images/CircleAdventurer.png'
import DMCircle from '../../assets/images/CircleDM.png'

const HomaPage = () => {
    return (
        <div className={styles.container}>
            <Link to="/AdventurerLogin">
                <img src={AdvCircle} className={styles.roundImage} />
            </Link>
            <img src={logo} alt="AID Master logo" className={styles.logo} />
            <Link to="/DMLogin">
                <img src={DMCircle} className={styles.roundImage} />
            </Link>
        </div>
    )
}

export default HomaPage
