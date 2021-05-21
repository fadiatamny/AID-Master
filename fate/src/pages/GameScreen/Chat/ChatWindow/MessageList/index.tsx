import React from 'react'
import Message, { MessageProps } from './Message'
import styles from './styles.module.css'

export interface MessagesListProps {
    data: Array<MessageProps>
    activeChat: string
}

const MessagesList = ({ data, activeChat }: MessagesListProps) => {
    return (
        <div className={`col-11 ${styles.container}`}>
            {data.map((message, i) => {
                if (activeChat == 'All')
                    return (
                        <div
                            key={i}
                            className={`row ${message.myMessage ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                            <div className={`${styles.messageContainer} `}>
                                <Message
                                    username={message.username}
                                    playerName={message.playerName}
                                    messageText={message.messageText}
                                    myMessage={message.myMessage}
                                />
                            </div>
                        </div>
                    )
                else if (activeChat == message.username || message.myMessage)
                    return (
                        <div
                            key={i}
                            className={`row ${message.myMessage ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                            <div className={`${styles.messageContainer} `}>
                                <Message
                                    username={message.username}
                                    playerName={message.playerName}
                                    messageText={message.messageText}
                                    myMessage={message.myMessage}
                                />
                            </div>
                        </div>
                    )
            })}

        </div>
    )
}

export default MessagesList
// <div className={`col-md-8 col-xl-6 ${styles.chat}`}>
//     <div className={styles.card}>
//         <div className={`${styles.cardheader} ${styles.msg_head}`}>
//             <p>{activeChat}</p>
//         </div>
//         <div className={`card-body ${styles.msg_card_body}`}>
//             {mockDataMessages.map((message, i) => {
//                 if (activeChat == 'All')
//                     return (
//                         <div key={i} className="mb-4">
//                             <Message
//                                 username={message.username}
//                                 playerName={message.playerName}
//                                 messageText={message.messageText}
//                                 myMessage={message.myMessage}
//                             />
//                         </div>
//                     )
//                 else if (activeChat == message.username)
//                     return (
//                         <div key={i} className="mb-4">
//                             <Message
//                                 username={message.username}
//                                 playerName={message.playerName}
//                                 messageText={message.messageText}
//                                 myMessage={message.myMessage}
//                             />
//                         </div>
//                     )
//             })}
//         </div>
//     </div>
// </div>




{/* <div className={`row justify-content-start`}>
<div className={`${styles.messageContainer} `}>
    <Message
        username="Poop"
        playerName="Fadi"
        messageText="Im a poopy head but a great programmer and am a nice dude"
        myMessage={false}
    />
</div>
</div>
<div className={`row justify-content-end`}>
<div className={`${styles.messageContainer} `}>
    <Message username="Neko" playerName="Annieli" messageText="Fadi is a poopy head" myMessage={true} />
</div>
</div>
<div className={`row justify-content-start`}>
<div className={`${styles.messageContainer} `}>
    <Message username="Poop" playerName="Fadi" messageText="Im a poopy head" myMessage={false} />
</div>
</div>
<div className={`row justify-content-start`}>
<div className={`${styles.messageContainer} `}>
    <Message username="Poop" playerName="Fadi" messageText="Im a poopy head" myMessage={false} />
</div>
</div>
<div className={`row justify-content-start`}>
<div className={`${styles.messageContainer} `}>
    <Message username="Poop" playerName="Fadi" messageText="Im a poopy head" myMessage={false} />
</div>
</div>
<div className={`row justify-content-start`}>
<div className={`${styles.messageContainer} `}>
    <Message username="Poop" playerName="Fadi" messageText="Im a poopy head" myMessage={false} />
</div>
</div>
<div className={`row justify-content-end`}>
<div className={`${styles.messageContainer} `}>
    <Message username="Neko" playerName="Annieli" messageText="Fadi is a poopy head" myMessage={true} />
</div>
</div>
<div className={`row justify-content-end`}>
<div className={`${styles.messageContainer} `}>
    <Message username="Neko" playerName="Annieli" messageText="Fadi is a poopy head" myMessage={true} />
</div>
</div> */}