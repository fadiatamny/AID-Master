import styles from './Button.module.css'
import BButton from 'react-bootstrap/Button'

export interface PlusMinusProps {
    onClick?: () => void
    children: JSX.Element
    className?: string
    forLabel?: boolean
}

const Button = ({ onClick, children, className, forLabel }: PlusMinusProps) => {
    return (
        <div className={`${styles.button} ${className}`}>
            <BButton onClick={onClick} className={`${styles.buttonStyling} ${forLabel ? styles.noRound : ''}`}>
                {children}
            </BButton>
        </div>
    )
}

export default Button
