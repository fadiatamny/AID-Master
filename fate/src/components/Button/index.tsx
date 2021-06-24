import styles from './styles.module.css'
import BButton from 'react-bootstrap/Button'

export interface ButtonProps {
    onClick?: () => void
    children?: JSX.Element | string
    className?: string
    forLabel?: boolean
    disabled?: boolean
    fullWidth?: boolean
}

const Button = ({ onClick, children, className, forLabel, disabled, fullWidth }: ButtonProps) => {
    return (
        <BButton
            style={fullWidth ? { width: '100%' } : {}}
            onClick={onClick}
            disabled={disabled}
            className={`${className ?? ''} ${styles.buttonStyling} ${forLabel ? styles.noRound : ''}`}
        >
            {children}
        </BButton>
    )
}

export default Button
