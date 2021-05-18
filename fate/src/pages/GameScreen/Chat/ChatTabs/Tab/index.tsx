import styles from './styles.module.css'

export interface TabProps {
    username: string
    charactername: string
}

const Tab = ({ username, charactername }: TabProps) => {
    const shortifyString = (s: string) => {
        if (s.length >= 15) {
            return s.substring(0, 15) + '...'
        }
        return s
    }
    return (
        <div className={styles.container}>
            <p className={styles.username}>{shortifyString(username)}</p>
            <p className={styles.charactername}>{shortifyString(charactername)}</p>
        </div>
    )
}

export default Tab
