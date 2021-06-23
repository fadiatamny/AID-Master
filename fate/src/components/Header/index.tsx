import styles from './styles.module.css'
import logo from '../../assets/images/Logo.png'
import Button from '../Button'
import { Link } from 'react-router-dom'

interface HeaderProps {
    endGameButton?: boolean
    onEndSubmit?: () => void
}

const Header = ({ endGameButton, onEndSubmit }: HeaderProps) => {
    return (
        <div className={styles.container}>
            <img src={logo} className={styles.logo} />
            <Link to="/" className={styles.title}>
                AI Dungeon Master
            </Link>
            <div className={styles.settings}>{endGameButton ? <Button onClick={onEndSubmit}></Button> : null}</div>
        </div>
    )
}

export default Header
