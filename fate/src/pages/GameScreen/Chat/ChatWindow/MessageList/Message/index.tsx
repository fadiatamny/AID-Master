import Card from 'react-bootstrap/Card'
import styles from './styles.module.css'

export interface MessageProps {
    username: string
    playerName: string
    messageText: string
    myMessage: boolean
}

const Message = ({ username, playerName, messageText, myMessage }: MessageProps) => {
    return (
        <Card className={myMessage ? styles.mymessage : ''}>
            <Card.Body>
                <Card.Title className={styles.title}>{username}</Card.Title>
                <Card.Subtitle className={`${styles.subtitle} ${myMessage ? 'text-white mb-2' : 'text-muted mb-2'}`}>
                    {playerName}
                </Card.Subtitle>
                <Card.Text className={styles.content}>{messageText}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Message
