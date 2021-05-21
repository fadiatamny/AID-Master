import io, { Socket } from 'socket.io-client'
import EventsManager, { SocketEvent } from './EventsManager'
const endpoint = 'https://localhost:5069'

export default class SocketManager {
    private static _instance: SocketManager

    public static get instance() {
        if (!SocketManager._instance) {
            SocketManager._instance = new SocketManager()
        }
        return SocketManager._instance
    }

    private _socket: Socket
    constructor() {
        this._socket = io(endpoint)
        EventsManager.instance.on(SocketEvent.CONNECT, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('connected', () => {
            EventsManager.instance.trigger(SocketEvent.CONNECTED, {})
        })
    }
}
