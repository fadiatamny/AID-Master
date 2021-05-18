import styles from './StartingPages.module.css'
import Input from '../../components/Input/Input'
import AdvCircle from '../../assets/images/CircleAdventurer.png'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const AdvLoginScreen = () => {
    const [roomNumber, setRoomNumber] = useState('')

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        alert(roomNumber)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomNumber(event.target.value)
    }

    return (
        <div className={styles.container}>
            <img src={AdvCircle} className={styles.roundImage} />
            <form onSubmit={handleSubmit}>
                <Input
                    id="AdvRoomEnter"
                    className={styles.advRoomCode}
                    label="Enter Room Code"
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    onChange={handleChange}
                />
                <input type="submit" value="submit" />
            </form>
            <Link className={styles.backButton} to="/">
                Back to Home Page
            </Link>
        </div>
    )
}

export default AdvLoginScreen
