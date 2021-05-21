import styles from './GameScreen.module.css'
import Header from '../../components/Header/Header'
import Chat from './Chat/Chat'

// export interface GameScreenProps{}

const GameScreen = () => {
    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.characterContainer}>Characters Sheet</div>
                <div className={styles.mapDiceContainer}>
                    <div className={styles.mapContainer}>Map</div>
                    <div className={styles.diceContainer}>Dice</div>
                </div>
                <div className={styles.chatContainer}>
                    <Chat />
                </div>
            </div>
        </div>
    )
}

export default GameScreen
