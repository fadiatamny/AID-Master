import Card from 'react-bootstrap/Card'
import styles from './Message.module.css'

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
                <Card.Title>{username}</Card.Title>
                <Card.Subtitle className={myMessage ? 'text-white mb-2' : 'text-muted mb-2'}>
                    {playerName}
                </Card.Subtitle>
                <Card.Text>{messageText}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Message
