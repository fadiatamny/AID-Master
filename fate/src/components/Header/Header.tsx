import styles from './Header.module.css'
import logo from '../../assets/images/Logo.png'
import user from '../../assets/images/ProfileImage.png'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div className={styles.container}>
            <img src={logo} className={styles.logo} />
            <Link to="/" className={styles.title}>
                AI Dungeon Master
            </Link>
            <img src={user} className={styles.user} />
        </div>
    )
}

export default Header
