import styles from './Message.module.css'

export interface MessageModel {
    message: string
    name: string
}
export interface IMessageProps {
    message: MessageModel
    name: string
}

export default function Message(props: IMessageProps) {
    let isSentByCurrentUser = false
    const { message, name } = props.message
    const trimmedName = name?.trim().toLowerCase()

    if (props.name === trimmedName) {
        isSentByCurrentUser = true
    }

    return isSentByCurrentUser ? (
        <div className={`${styles.messageContainer} ${styles.justifyEnd}`}>
            <p className={`${styles.sentText} ${styles.prTen}`}>{trimmedName}</p>
            <div className={`${styles.messageBox} ${styles.backgroundBlue}`}>
                <p className={`${styles.messageText} ${styles.colorWhite}`}>{message}</p>
            </div>
        </div>
    ) : (
        <div className={`${styles.messageContainer} ${styles.justifyStart}`}>
            <div className={`${styles.messageBox} ${styles.backgroundLight}`}>
                <p className={`${styles.messageText} ${styles.colorDark}`}>{message}</p>
            </div>
            <p className={`${styles.sentText} ${styles.plTen}`}>{trimmedName}</p>
        </div>
    )
}
