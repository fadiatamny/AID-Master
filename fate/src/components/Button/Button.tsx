import styles from './Button.module.css'

export interface ButtonProps {
    img: string
    onClick: () => void
}

const Button = ({ img, onClick }: ButtonProps) => {
    return (
        <div>
            <button style={styles} onClick={onClick}>
                <img src={img} alt="adventurer circle" />
            </button>
        </div>
    )
}

export default Button
