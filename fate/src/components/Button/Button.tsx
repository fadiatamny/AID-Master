import styles from './Button.module.css'
import InputGroup from 'react-bootstrap/InputGroup'
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
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <BButton onClick={onClick} className={`${styles.buttonStyling} ${forLabel ? styles.noRound : ''}`}>
                        {children}
                    </BButton>
                </InputGroup.Prepend>
            </InputGroup>
        </div>
    )
}

export default Button
