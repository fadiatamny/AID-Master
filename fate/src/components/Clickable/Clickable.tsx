import React from 'react'

export interface ClickableProps {
    children: JSX.Element
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: (e?: any) => void
    style?: React.CSSProperties
}

const Clickable = ({ children, onClick, style }: ClickableProps) => {
    return (
        <div onClick={onClick} className={`${style}`}>
            {children}
        </div>
    )
}

export default Clickable
