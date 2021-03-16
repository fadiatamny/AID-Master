import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import { Redirect } from 'react-router-dom';

const ENDPOINT = 'localhost:5069';
let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        const { name , room, player } = queryString.parse(location.search)
        
        socket = io(ENDPOINT);
        

        setName(name);
        setRoom(room);
        if (player == "dm"){
            console.log('create');
            socket.emit('createRoom', { name }, ( error ) => {
                if(error){
                    alert(error);
                }
            socket.on('roomCreated', ({id}) => {
                setMessages([...messages, `room id: ${id}`]);
            })
            });
        }
        else{
            // console.log('join');
            // socket.emit('joinRoom', { room, name }, ( arg ) => {
            //    socket.on('error', ({message}) => {
            //     console.log('error');
            //     alert(message);
            //     return <Redirect to='/' />;
 
            //    })

            //    socket.on('joinedRoom', (name) => {
            //        console.log('joined');
            //     setMessages([...messages, `${name} welcome to the game`]);
            // })
            //     // if(error){
            //     //     setRedirect(true);
            //     //     alert(error);
            //     //     if(redirect){
            //     //         return <Redirect to='/' />;
            //     //     }
            //     // }
            // });
        }
         return () => {
            socket.emit('disconnect');
           
            socket.off();
         }
    },[ENDPOINT, location.search])

    useEffect(() => {
        socket.on('message', (message) => {
            console.log(message);
            setMessages([...messages, message]);
        });

    socket.on("roomData", ({user}) => {
        setUsers(users);
    });
    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();
       if(message){
           socket.emit('sendMessage', message, () => setMessage(''));
       }
    }


    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages name={name} messages={messages}></Messages>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    )
}

export default Chat;