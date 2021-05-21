import styles from './styles.module.css'

const Divider = () => {
    return (
        <div className={`row justify-content-center ${styles.container}`}>
            <div className={`${styles.divider}`} />
        </div>
    )
}

export default Divider
