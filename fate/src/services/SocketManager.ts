import io, { Socket } from 'socket.io-client'
import { GameDump } from '../models/GameSession.model'
import { PlayerType, IPlayer } from '../models/Player.model'
import EventsManager, { SocketEvent } from './EventsManager'
const endpoint = 'http://localhost:5069'

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
        const emitsHandler = {
            [SocketEvent.HI]: this._hi.bind(this)
            // [SocketEvent.ROOMCREATED]: this._roomCreated.bind(this),
            // [SocketEvent.MESSAGESENT]: this._messageSent.bind(this),
            // [SocketEvent.SENARIOSENT]: this._scenarioSent.bind(this),
            // [SocketEvent.JOINROOM]: this._joinRoom.bind(this),
            // [SocketEvent.ROOMLEAVED]: this._roomLeaved.bind(this)
        }
        /*
emit:
        [SocketEvent.CONNECT]: this._connected.bind(this),
        [SocketEvent.ROOMJOINED]: this._roomJoined.bind(this),
        [SocketEvent.SENDMESSAGE]: this._sendMessage.bind(this),
        [SocketEvent.DMCHANGED]: this._dmChanged.bind(this),
        [SocketEvent.ROOMCREATED]: this._roomCreated.bind(this),
        [SocketEvent.PLAYERDATA]: this._playerData.bind(this),
        [SocketEvent.MESSAGE]: this._message.bind(this),
        [SocketEvent.SCENARIO]: this._scenario.bind(this),
        [SocketEvent.SCENARIOGUIDE]: this._scenarioGuide.bind(this),
        [SocketEvent.ERROR]: this._error.bind(this)

    on:
        ['createRoom']: this._createRoom.bind(this),
        ['sendmessage']: this._sendMessage.bind(this),
        ['sendScenario']: this._sendScenario.bind(this),
        ['joinroom']: this._joinRoom.bind(this),
        ['leaveroom']: this._leaveRoom.bind(this)
*/

        const onsHandler = {
            [SocketEvent.HELLO]: this._hello.bind(this),
            [SocketEvent.CONNECT]: this._connect.bind(this)
            // [SocketEvent.ROOMJOINED]: this._roomJoined.bind(this),
            // [SocketEvent.SENDMESSAGE]: this._sendMessage.bind(this),
            // [SocketEvent.DMCHANGED]: this._dmChanged.bind(this),
            // [SocketEvent.ROOMCREATED]: this._roomCreated.bind(this),
            // [SocketEvent.PLAYERDATA]: this._playerData.bind(this),
            // [SocketEvent.MESSAGE]: this._message.bind(this),
            // [SocketEvent.SCENARIO]: this._scenario.bind(this),
            // [SocketEvent.SCENARIOGUIDE]: this._scenarioGuide.bind(this),
            // [SocketEvent.ERROR]: this._error.bind(this)
        }

        Object.entries(emitsHandler).forEach(([key, value]) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            EventsManager.instance.on(key as any as SocketEvent, 'socket-manager', value)
        )

        this._socket = io(endpoint)
        this._socket.on(SocketEvent.CONNECT, this._connected.bind(this))
        Object.entries(onsHandler).forEach(([key, value]) => this._socket.on(key, value))
    }

    private _connect() {
        if (!this._socket) {
            console.log('connecting')
            this._socket = io(endpoint)
        }
    }
    private _connected() {
        EventsManager.instance.trigger(SocketEvent.CONNECTED, {})
    }

    private _hi() {
        this._socket.emit(SocketEvent.HI, {})
    }

    private _hello() {
        EventsManager.instance.trigger(SocketEvent.HELLO, {})
    }

    private _roomLeaved(id: string, userId: string) {
        EventsManager.instance.trigger(SocketEvent.ROOMLEAVED, { id, userId })
    }

    private _scenarioSent(username: string, message: string) {
        EventsManager.instance.trigger(SocketEvent.SENARIOSENT, { username, message })
    }

    private _messageSent(id: string, username: string, massege: string, target: string) {
        EventsManager.instance.trigger(SocketEvent.MESSAGESENT, { id, username, massege, target })
    }

    private _joinRoom(id: string, userId: string, data: IPlayer) {
        EventsManager.instance.trigger(SocketEvent.JOINROOM, { id, userId, data })
    }

    private _createRoom(userId: string, username: string, data: GameDump) {
        EventsManager.instance.trigger(SocketEvent.CREATEROOM, { userId, username, data })
    }

    private _scenario(username: string, message: string) {
        EventsManager.instance.trigger(SocketEvent.SCENARIO, { username, message })
    }

    private _leaveRoom(id: string, userId: string) {
        EventsManager.instance.trigger(SocketEvent.LEAVEROOM, { id, userId })
    }

    private _message(username: string, message: string, target: string) {
        EventsManager.instance.trigger(SocketEvent.MESSAGE, { username, message, target })
    }

    private _roomCreated(id: string) {
        EventsManager.instance.trigger(SocketEvent.ROOMCREATED, { id })
    }

    private _sendMessage(id: string, username: string, massege: string, target: string) {
        EventsManager.instance.trigger(SocketEvent.SENDMESSAGE, { id, username, massege, target })
    }

    private _roomJoined(username: string, type: PlayerType) {
        EventsManager.instance.trigger(SocketEvent.ROOMJOINED, { username, type })
    }

    private _playerData(playerid: string, playerdata: string) {
        EventsManager.instance.trigger(SocketEvent.PLAYERDATA, { playerid, playerdata })
    }

    private _error(username: string, message: string) {
        EventsManager.instance.trigger(SocketEvent.ERROR, { username, message })
    }
    private _sendScenario(username: string, message: string) {
        EventsManager.instance.trigger(SocketEvent.SENDSENARIO, { username, message })
    }

    private _dmChanged(playerid: string) {
        EventsManager.instance.trigger(SocketEvent.DMCHANGED, { playerid })
    }

    private _scenarioGuide(username: string, message: string) {
        EventsManager.instance.trigger(SocketEvent.SCENARIOGUIDE, { username, message })
    }
}
