import React from 'react'

export interface ClickableProps {
    children: JSX.Element
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: (e?: any) => void
    style?: React.CSSProperties
    className?: string
}

const Clickable = ({ children, onClick, style, className }: ClickableProps) => {
    return (
        <div onClick={onClick} className={`${className}`} style={style}>
            {children}
        </div>
    )
}

export default Clickable
