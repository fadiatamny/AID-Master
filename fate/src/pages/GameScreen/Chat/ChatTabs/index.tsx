import { Col } from 'react-bootstrap'
import Clickable from '../../../../components/Clickable/Clickable'
import Divider from '../../../../components/Divider'
import styles from './styles.module.css'
import Tab from './Tab'

export interface ChatTabsProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users: Array<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    general: Array<any>
    switchActive: (name: string) => void
}

const ChatTabs = ({ users, general, switchActive }: ChatTabsProps) => {
    return (
        <Col>
            <div className={`${styles.container}`}>
                {general.map((user, i) => (
                    <Clickable key={i} onClick={() => switchActive(user.username)}>
                        <Tab username={user.username} charactername={user.playername} isActive={user.isActive} />
                    </Clickable>
                ))}
                <Divider style={{ width: '80%' }} />
                {users?.map((user, i) => (
                    <Clickable key={i} onClick={() => switchActive(user.username)}>
                        <Tab username={user.username} charactername={user.playername} isActive={user.isActive} />
                    </Clickable>
                ))}
            </div>
        </Col>
    )
}

export default ChatTabs
