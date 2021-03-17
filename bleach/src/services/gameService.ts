import axios from 'axios'
import uniqid from 'uniqid'
import { Server, Socket } from 'socket.io'

interface Dictionary {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [Key: string]: any
}

let io: Server

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onsHandler: { [key: string]: (...args: any[]) => void } = {}
const emitsHandler: { [key: string]: Dictionary } = {}

//#region Ons
onsHandler['createRoom'] = function () {
    const id = uniqid()
    this.join(id.toString())
    this.emit('roomCreated', id.toString())
}
onsHandler['joinRoom'] = function (id: string, username: string) {
    try {
        const room = io.sockets.adapter.rooms.get(id)

        if (room) {
            this.join(id)
            io.sockets.in(id).emit('joinedRoom', username)
        } else {
            this.emit('error', {
                message: `This room ${id} does not exist.`
            })
        }
    } catch (err) {
        console.log(err.message)
        this.emit('error', {
            message: `There was an issue`,
            error: err
        })
    }
}
onsHandler['sendMessage'] = (id: string, username: string, message: string, target?: string) => {
    io.sockets.in(id).emit('message', username, message, target)
}
onsHandler['sendSenario'] = async (id: string, username: string, scenario: string) => {
    io.sockets.in(id).emit('scenario', scenario)
    const res = await axios.post(`${process.env.AMNESIA_ENDPOINT}/api/predict`, {
        text: scenario
    })
    io.sockets.in(id).emit('scenarioGuide', username, res.data)
}
//#endregion

//#region emits
emitsHandler['connected'] = { message: 'You are connected!' }
//#endregion

export const initSocket = (sio: Server, socket: Socket) => {
    io = sio
    Object.entries(emitsHandler).forEach(([key, value]) => socket.emit(key, value))
    Object.entries(onsHandler).forEach(([key, value]) => socket.on(key, value))
}
