import styles from './styles.module.css'
import BButton from 'react-bootstrap/Button'

export interface ButtonProps {
    onClick?: () => void
    children: JSX.Element
    className?: string
    forLabel?: boolean
    disabled?: boolean
}

const Button = ({ onClick, children, className, forLabel, disabled }: ButtonProps) => {
    return (
        <div className={`${styles.button} ${className}`}>
            <BButton
                onClick={onClick}
                disabled={disabled}
                className={`${styles.buttonStyling} ${forLabel ? styles.noRound : ''}`}
            >
                {children}
            </BButton>
        </div>
    )
}

export default Button
