import styles from './Clickable.module.css'

export interface ClickableProps {
    children: JSX.Element
    onClick: () => void
}

const Clickable = ({ children, onClick }: ClickableProps) => {
    return (
        <div onClick={onClick} className={styles.clickable}>
            {children}
        </div>
    )
}

export default Clickable
