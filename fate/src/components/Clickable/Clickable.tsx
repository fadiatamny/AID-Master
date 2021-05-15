import styles from './Clickable.module.css'

export interface ClickableProps {
    children: JSX.Element
    onclick: () => void
}

const Clickable = ({ children, onclick }: ClickableProps) => {
    return (
        <div onClick={onclick} className={styles.clickable}>
            {children}
        </div>
    )
}

export default Clickable
