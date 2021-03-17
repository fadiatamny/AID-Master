import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.module.css';
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
   const [name, setName] = useState('');
   const [room, setRoom] = useState('');
   const [users, setUsers] = useState('');
   const [message, setMessage] = useState('');
   const [messages, setMessages] = useState([]);

   const sendMessage = () => {
//     event.preventDefault();
//    if(message){
//        socket.emit('sendMessage', message, () => setMessage(''));
//    }
}

  return (
    <div className="outerContainer">
        <div className="container">
            <InfoBar room={room} />
            <Messages name={name} messages={messages}></Messages>
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
    </div>
  );
}
