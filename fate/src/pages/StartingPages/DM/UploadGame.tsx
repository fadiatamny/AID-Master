import styles from '../StartingPages.module.css'
import { Link } from 'react-router-dom'
import Header from '../../../components/Header/Header'

const UploadGame = () => {
    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h1>upload</h1>
                <Link className={styles.backButton} to="/DMLogin">
                    Back to Selection Page
                </Link>
            </div>
        </div>
    )
}

export default UploadGame
