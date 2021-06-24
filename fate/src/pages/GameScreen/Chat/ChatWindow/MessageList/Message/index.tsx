import Card from 'react-bootstrap/Card'
import styles from './styles.module.css'

export interface MessageProps {
    username: string
    playername: string
    messageText: string | string[]
    myMessage: boolean
}

const Message = ({ username, playername, messageText, myMessage }: MessageProps) => {
    const flipComponent = () => {
        return null
    }
    return (
        <Card className={myMessage ? styles.mymessage : ''}>
            <Card.Body>
                <Card.Title className={styles.title}>{playername}</Card.Title>
                <Card.Subtitle
                    className={`${styles.subtitle} ${myMessage ? 'text-white mb-2' : `mb-2  ${styles.otherMessage}`}`}
                >
                    {username}
                </Card.Subtitle>
                <Card.Text className={styles.content}>
                    {
                        // insert here the flip component make sure its with a button and swaps bettwen this view
                        // and the npm package view.
                    }
                    {messageText}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Message
