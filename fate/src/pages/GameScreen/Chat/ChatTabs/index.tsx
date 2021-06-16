import Clickable from '../../../../components/Clickable/Clickable'
import Divider from '../../../../components/Divider'
import styles from './styles.module.css'
import Tab from './Tab'
import { Container, Row, Col } from 'react-bootstrap'

export interface ChatTabsProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users: Array<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    general: Array<any>
    switchActive: (name: string) => void
}

const ChatTabs = ({ users, general, switchActive }: ChatTabsProps) => {
    return (
        <Container fluid className={`${styles.container}`}>
            {general.map((user, i) => (
                <Row key={i} className="justify-content-center">
                    <Clickable onClick={() => switchActive(user.username)}>
                        <Tab username={user.username} charactername={user.playername} isActive={user.isActive} />
                    </Clickable>
                </Row>
            ))}
            <Row className="justify-content-center">
                <Divider style={{ width: '80%' }} />
            </Row>
            {users?.map((user, i) => (
                <Row key={i} className="justify-content-center">
                    <Clickable onClick={() => switchActive(user.username)}>
                        <Tab username={user.username} charactername={user.playername} isActive={user.isActive} />
                    </Clickable>
                </Row>
            ))}
        </Container>
    )
}

export default ChatTabs
