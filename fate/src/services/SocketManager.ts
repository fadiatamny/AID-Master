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
            [SocketEvent.HI]: this._hi.bind(this),
            [SocketEvent.ROOM_CREATING]: this._roomCreating.bind(this),
            [SocketEvent.SEND_MESSAGE]: this._sendMessage.bind(this),
            [SocketEvent.SEND_SCENARIO]: this._sendScenario.bind(this),
            [SocketEvent.JOIN_ROOM]: this._joinRoom.bind(this),
            [SocketEvent.LEAVE_ROOM]: this._leaveRoom.bind(this)
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
            [SocketEvent.CONNECT]: this._connect.bind(this),
            [SocketEvent.JOINED_ROOM]: this._roomJoined.bind(this),
            [SocketEvent.DM_CHANGED]: this._dmChanged.bind(this),
            [SocketEvent.ROOM_CREATED]: this._roomCreated.bind(this),
            [SocketEvent.PLAYER_DATA]: this._playerData.bind(this),
            [SocketEvent.MESSAGE]: this._reciveMessage.bind(this),
            [SocketEvent.SCENARIO]: this._scenario.bind(this),
            [SocketEvent.SCENARIOGUIDE]: this._scenarioGuide.bind(this),
            [SocketEvent.ERROR]: this._error.bind(this)
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

    private _sendMessage(id: string, username: string, messege: string, target: string) {
        this._socket.emit(SocketEvent.MESSAGESENT, { id, username, messege, target })
    }

    private _reciveMessage(id: string, username: string, messege: string, target: string) {
        EventsManager.instance.trigger(SocketEvent.MESSAGE, { id, username, messege, target })
    }
    private _joinRoom(id: string, userId: string, data: IPlayer) {
        this._socket.emit(SocketEvent.JOIN_ROOM, { id, userId, data })
    }

    private _roomJoined(username: string, type: PlayerType) {
        EventsManager.instance.trigger(SocketEvent.JOINED_ROOM, { username, type })
    }

    private _roomCreating(id: string) {
        this._socket.emit(SocketEvent.ROOM_CREATING, { id })
    }

    private _roomCreated(id: string) {
        EventsManager.instance.trigger(SocketEvent.ROOM_CREATED, { id })
    }

    private _sendScenario(username: string, message: string) {
        this._socket.emit(SocketEvent.SEND_SCENARIO, { username, message })
    }

    private _scenarioGuide(username: string, message: string) {
        EventsManager.instance.trigger(SocketEvent.SCENARIOGUIDE, { username, message })
    }

    private _leaveRoom(id: string, userId: string) {
        this._socket.emit(SocketEvent.LEAVE_ROOM, { id, userId })
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////

    private _scenario(username: string, message: string) {
        EventsManager.instance.trigger(SocketEvent.SCENARIO, { username, message })
    }

    private _playerData(playerid: string, playerdata: string) {
        EventsManager.instance.trigger(SocketEvent.PLAYER_DATA, { playerid, playerdata })
    }

    private _error(username: string, message: string) {
        EventsManager.instance.trigger(SocketEvent.ERROR, { username, message })
    }

    private _dmChanged(playerid: string) {
        EventsManager.instance.trigger(SocketEvent.DM_CHANGED, { playerid })
    }
}
