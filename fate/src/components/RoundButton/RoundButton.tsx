import styles from './RoundButton.module.css'

export interface RoundButtonProps {
    img: string
    onClick: () => void
}

const Button = ({ img, onClick }: RoundButtonProps) => {
    return (
        <div>
            <button style={styles} onClick={onClick}>
                <img src={img} alt="adventurer circle" />
            </button>
        </div>
    )
}

export default Button
