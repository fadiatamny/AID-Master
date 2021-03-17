import React from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import styles from './Chat.module.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

export interface IChatProps {
    room: string,
    name: string,
    message: string,
    sendMessage: Function
}

export default function Chat (props: IChatProps) {
   const [name, setName] = React.useState('');
   const [room, setRoom] = React.useState('');
   const [users, setUsers] = React.useState('');
   const [message, setMessage] = React.useState('');
   const [messages, setMessages] = React.useState([]);

   const sendMessage = () => {
//     event.preventDefault();
//    if(message){
//        socket.emit('sendMessage', message, () => setMessage(''));
//    }
}

  return (
    <div className={styles.outerContainer}>
        <div className={styles.container}>
            <InfoBar room={room} />
            <Messages name={name} messages={messages}></Messages>
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
    </div>
  );
}
