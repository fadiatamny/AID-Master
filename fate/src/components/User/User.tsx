import styles from './User.module.css'
export interface UserProps {
    username: string
    playername: string
}

const User = ({ username, playername }: UserProps) => {
    return (
        <div className={styles.container}>
            <span className={styles.username}>{username}</span>
            <span className={styles.playername}>{playername}</span>
        </div>
    )
}

export default User
