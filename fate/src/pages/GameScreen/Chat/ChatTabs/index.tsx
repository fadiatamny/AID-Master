import React from 'react'
import Clickable from '../../../../components/Clickable/Clickable'
import styles from './styles.module.css'
import Tab from './Tab'

export interface ChatTabsProps {
    users: Array<any>
    switchActive: (name: string) => void
}

const ChatTabs = ({ users, switchActive }: ChatTabsProps) => {
    return (
        <div className="col">
            <div className={`${styles.container}`}>
                {users.map((user, i) => (
                    <Clickable key={i} onClick={() => switchActive(user.username)}>
                        <Tab username={user.username} charactername={user.playerName} />
                    </Clickable>
                ))}
            </div>
        </div>
    )
}

export default ChatTabs
