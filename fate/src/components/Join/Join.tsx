import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Join.module.css'

export default function Join() {
    const [name, setName] = React.useState('')
    const [room, setRoom] = React.useState('')

    return (
        <div className={styles.joinOuterContainer}>
            <div className={styles.joinInnerContainer}>
                <h1 className="heading">Join</h1>
                <div>
                    <input
                        placeholder="Name"
                        className={styles.joinInput}
                        type="text"
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <div>
                    <input
                        placeholder="Room"
                        className={`${styles.joinInput} ${styles.mtTwenty}`}
                        type="text"
                        onChange={(event) => setRoom(event.target.value)}
                    />
                </div>

                <Link
                    onClick={(event) => (!name ? event.preventDefault() : null)}
                    to={`/chat?name=${name}&room=${room}`}
                >
                    <button className={`${styles.button} ${styles.mtTwenty}`} type="submit">
                        Enter Room
                    </button>
                </Link>
            </div>
        </div>
    )
}
