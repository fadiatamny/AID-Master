import { Server, Socket } from "socket.io"

let io: Server
let iSocket: Socket

export const initSocket = (sio: Server, socket: Socket) => {
    io = sio
    iSocket = socket
    iSocket.emit('connected', {
        message: "You are connected!"
    })
}