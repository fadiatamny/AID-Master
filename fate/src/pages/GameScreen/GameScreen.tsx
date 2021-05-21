import styles from './GameScreen.module.css'
import Header from '../../components/Header/Header'
import Chat from './Chat'

// export interface GameScreenProps{}

const GameScreen = () => {
    return (
        <div>
            <Header />
            <div className={`${styles.container} row`}>
                <Chat />
            </div>
        </div>
    )
}

export default GameScreen
