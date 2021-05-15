import styles from './PlusMinus.module.css'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'

export interface PlusMinusProps {
    onClick: () => void
    children: JSX.Element
}

const PlusMinus = ({ onClick, children }: PlusMinusProps) => {
    return (
        <div className={styles.button}>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <Button variant="outline-secondary" onClick={onClick} style={{ width: '40px', height: '40px' }}>
                        {children}
                    </Button>
                </InputGroup.Prepend>
            </InputGroup>
        </div>
    )
}

export default PlusMinus
