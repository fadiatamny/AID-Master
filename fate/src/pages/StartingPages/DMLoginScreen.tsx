import { Link } from 'react-router-dom'
import styles from './StartingPages.module.css'
import newCircle from '../../assets/images/CircleNew.png'
import uploadCircle from '../../assets/images/CircleUpload.png'
import logo from '../../assets/images/Logo.png'
import Header from '../../components/Header/Header'

const DMLoginScreen = () => {
    return (
        <div>
            <Header />
            <div className={styles.container}>
                <Link to="/newGame">
                    <img src={newCircle} className={styles.roundImage} />
                </Link>
                <img src={logo} alt="AID Master logo" className={styles.logo} />
                <Link to="/gameUpload">
                    <img src={uploadCircle} className={styles.roundImage} />
                </Link>
            </div>
        </div>
    )
}

export default DMLoginScreen
