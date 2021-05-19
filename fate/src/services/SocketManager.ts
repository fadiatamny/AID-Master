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
        this._socket.on('connected', (messege:string) => {
            EventsManager.instance.trigger(SocketEvent.CONNECTED, {})
        })
        EventsManager.instance.on(SocketEvent.MESSAGE, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('message', (username:string, massege:string,target:string) => {
            EventsManager.instance.trigger(SocketEvent.MESSAGE, {})
        })
        EventsManager.instance.on(SocketEvent.ROOMCREATED, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('roomcreatred', (id:string, mode:usermode) => {
            EventsManager.instance.trigger(SocketEvent.ROOMCREATED, {})
        })
        EventsManager.instance.on(SocketEvent.ROOMJOINED, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('roomjoined', (username:string, type:playertype) => {
            EventsManager.instance.trigger(SocketEvent.ROOMJOINED, {})
        })
        EventsManager.instance.on(SocketEvent.DMCHANGED, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('dmchanged', (playerid:string ) => {
            EventsManager.instance.trigger(SocketEvent.DMCHANGED, {})
        })
        EventsManager.instance.on(SocketEvent.PLAYERDATA, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('playerdata', (playerid:string,playerdata:string ) => {
            EventsManager.instance.trigger(SocketEvent.PLAYERDATA, {})
        })
        EventsManager.instance.on(SocketEvent.SCENARIO, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('scenario', (username:string,message:string ) => {
            EventsManager.instance.trigger(SocketEvent.SCENARIO, {})
        })
        EventsManager.instance.on(SocketEvent.SCENARIOGUIDE, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('scenatioguide', (username:string,message:string ) => {
            EventsManager.instance.trigger(SocketEvent.SCENARIOGUIDE, {})
        })
        EventsManager.instance.on(SocketEvent.ERROR, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('error', (username:string,message:string ) => {
            EventsManager.instance.trigger(SocketEvent.ERROR, {})
        })
    }
}
