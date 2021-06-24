import { Card, Row, Container, Col } from 'react-bootstrap'
import styles from './styles.module.css'
import ReactJson from 'react-json-view'
import { useRef, useState } from 'react'
import Button from '../../../../../../components/Button'

export interface MessageProps {
    username: string
    playername: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messageText: string | any
    myMessage: boolean
}

const Message = ({ username, playername, messageText, myMessage }: MessageProps) => {
    const [beautify, setBeautify] = useState(true)
    const beautifyRef = useRef(beautify)
    beautifyRef.current = beautify

    const flipComponent = () => {
        const jsonViewerStyle = { minWidth: '18vw', borderRadius: '5px', padding: '1vh 1vw' }
        return (
            <>
                <Button className={styles.swapButton} onClick={() => setBeautify(!beautifyRef.current)}>
                    {beautifyRef.current ? 'Show Precentages' : 'Prettify Text'}
                </Button>
                {beautifyRef.current ? (
                    messageText[0]
                ) : (
                    <ReactJson
                        style={jsonViewerStyle}
                        src={messageText[1]}
                        theme={'ocean'}
                        iconStyle={'square'}
                        collapsed={1}
                        collapseStringsAfterLength={15}
                        displayObjectSize={false}
                        displayDataTypes={false}
                    />
                )}
            </>
        )
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
                <div className={styles.content}>{Array.isArray(messageText) ? flipComponent() : messageText}</div>
            </Card.Body>
        </Card>
    )
}

export default Message
