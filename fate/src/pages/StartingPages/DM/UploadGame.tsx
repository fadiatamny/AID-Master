import styles from '../StartingPages.module.css'
import { Link } from 'react-router-dom'

const UploadGame = () => {
    return (
        <div className={styles.container}>
            <h1>upload</h1>
            <Link className={styles.backButton} to="/DMLogin">
                Back to Selection Page
            </Link>
            <Link className={styles.backButton} to="/">
                Back to Home Page
            </Link>
        </div>
    )
}

export default UploadGame
