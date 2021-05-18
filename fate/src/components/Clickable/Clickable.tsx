import React from 'react'
import styles from './Clickable.module.css'

export interface ClickableProps {
    children: JSX.Element
    onClick: () => void
    style?: React.CSSProperties
}

const Clickable = ({ children, onClick, style }: ClickableProps) => {
    return (
        <div onClick={onClick} className={`${styles.clickable} ${style}`}>
            {children}
        </div>
    )
}

export default Clickable
