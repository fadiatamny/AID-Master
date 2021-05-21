import styles from './User.module.css'
export interface UserProps {
    username: string
    playerName: string
}

const User = ({ username, playerName }: UserProps) => {
    return (
        <div className={styles.container}>
            <span className={styles.username}>{username}</span>
            <span className={styles.playerName}>{playerName}</span>
        </div>
    )
}

export default User
