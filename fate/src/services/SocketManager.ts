import io, { Socket } from 'socket.io-client'
import { PlayerType } from '../models/Player.model'
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

        const emitsHandler = {
            [SocketEvent.CONNECT]: this._connected.bind(this)
        }
        const onsHandler = {
            ['createRoom']: this._createRoom.bind(this),
            ['joinRoom']: this._joinRoom.bind(this),
            ['sendMessage']: this._sendMessage.bind(this),
            ['sendScenario']: this._sendScenario.bind(this),
            ['leaveRoom']: this._leaveRoom.bind(this),
            ['roomjoined']: this._roomJoined.bind(this)
        }

        Object.entries(emitsHandler).forEach(([key, value]) => EventsManager.instance.on(key as any as SocketEvent, 'socket-manager', value))
        Object.entries(onsHandler).forEach(([key, value]) => this._socket.on(key, value))


    }

    private _joinRoom(username: string, type: PlayerType) {
        EventsManager.instance.trigger(SocketEvent.ROOMJOINED, { username, type })
    }

    private _createRoom(id:string) {
        EventsManager.instance.trigger(SocketEvent.ROOMCREATED, { id })
    }
    private _connected(messege:string) {
        EventsManager.instance.trigger(SocketEvent.CONNECTED, {})
    }

    private _sendMessage(username:string,massege:string,target:string)  {
        EventsManager.instance.trigger(SocketEvent.MESSAGE, { username, massege, target })
    }

    private _roomJoined(username:string,type:PlayerType) {
        EventsManager.instance.trigger(SocketEvent.ROOMJOINED, { username, type })
    }
    

        EventsManager.instance.on(SocketEvent.CONNECT, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('connected', (messege: string) => {
            EventsManager.instance.trigger(SocketEvent.CONNECTED, {})
        })
        EventsManager.instance.on(SocketEvent.MESSAGE, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('message', (username: string, massege: string, target: string) => {
            EventsManager.instance.trigger(SocketEvent.MESSAGE, { username, massege, target })
        })
        EventsManager.instance.on(SocketEvent.ROOMCREATING, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('roomcreated', (id: string) => {
            EventsManager.instance.trigger(SocketEvent.ROOMCREATED, { id })
        })
        EventsManager.instance.on(SocketEvent.ROOMJOINING, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('roomjoined', (username: string, type: PlayerType) => {
            EventsManager.instance.trigger(SocketEvent.ROOMJOINED, { username, type })
        })
        EventsManager.instance.on(SocketEvent.DMCHANGEING, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('dmchanged', (playerid: string) => {
            EventsManager.instance.trigger(SocketEvent.DMCHANGED, { playerid })
        })
        EventsManager.instance.on(SocketEvent.RECPLAYERDATA, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('playerdata', (playerid: string, playerdata: string) => {
            EventsManager.instance.trigger(SocketEvent.PLAYERDATA, { playerid, playerdata })
        })
        EventsManager.instance.on(SocketEvent.RECSCENARIO, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('scenario', (username: string, message: string) => {
            EventsManager.instance.trigger(SocketEvent.SCENARIO, { username, message })
        })
        EventsManager.instance.on(SocketEvent.RECSCENARIOGUIDE, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('scenatioguide', (username: string, message: string) => {
            EventsManager.instance.trigger(SocketEvent.SCENARIOGUIDE, { username, message })
        })
        EventsManager.instance.on(SocketEvent.RECERROR, 'socket-manager', () => (this._socket = io(endpoint)))
        this._socket.on('error', (username: string, message: string) => {
            EventsManager.instance.trigger(SocketEvent.ERROR, { username, message })
        })
    }
}
