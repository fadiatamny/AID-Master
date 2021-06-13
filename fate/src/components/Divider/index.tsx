import styles from './styles.module.css'

interface DividerProps {
    style?: React.CSSProperties
}

const Divider = ({ style }: DividerProps) => {
    return (
        <div className={`row justify-content-center ${styles.container} `} style={style}>
            <div className={`${styles.divider}`} />
        </div>
    )
}

export default Divider
