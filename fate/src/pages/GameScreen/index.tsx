import styles from './styles.module.css'
import Header from '../../components/Header/Header'
import Chat from './Chat'

// export interface GameScreenProps{}

const GameScreen = () => {
    return (
        <div>
            <Header />
            <div className={`${styles.container}`}>
                <Chat />
            </div>
        </div>
    )
}

export default GameScreen
