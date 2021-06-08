import styles from './styles.module.css'

export interface TabProps {
    username: string
    charactername: string
    isActive?: boolean
}

const Tab = ({ username, charactername, isActive }: TabProps) => {
    const shortifyString = (s: string) => {
        if (s) {
            if (s.length >= 15) {
                return s.substring(0, 15) + '...'
            }
            return s
        }
    }
    return (
        <div className={`${styles.container} ${isActive ? styles.selected : ''}`}>
            <p className={styles.charactername}>{shortifyString(charactername)}</p>
            <p className={`${styles.username}`}>{shortifyString(username)}</p>
        </div>
    )
}

export default Tab
