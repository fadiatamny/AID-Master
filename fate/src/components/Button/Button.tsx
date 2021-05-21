import styles from './Button.module.css'
import InputGroup from 'react-bootstrap/InputGroup'
import BButton from 'react-bootstrap/Button'

export interface PlusMinusProps {
    onClick?: () => void
    children: JSX.Element
    className?: string
}

const Button = ({ onClick, children, className }: PlusMinusProps) => {
    return (
        <div className={`${styles.button} ${className}`}>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <BButton variant="outline-secondary" onClick={onClick} style={{ width: '40px', height: '40px' }}>
                        {children}
                    </BButton>
                </InputGroup.Prepend>
            </InputGroup>
        </div>
    )
}

export default Button
