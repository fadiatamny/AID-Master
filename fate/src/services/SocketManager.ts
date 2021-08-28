import io, { Socket } from 'socket.io-client'
import { CharacterSheet } from '../models/CharacterSheet.model'
import { PlayerDump } from '../models/Player.model'
import { Scenario } from '../models/Scenario.model'
import { SocketEvents } from '../models/SocketEvents.model'
import EventsManager from './EventsManager'
const endpoint = '/'

export interface SocketError {
    where: string
    message: string
    error: any
}

export default class SocketManager {
    private static _instance: SocketManager

    public static get instance() {
        if (!SocketManager._instance) {
            SocketManager._instance = new SocketManager()
        }
        return SocketManager._instance
    }

    public static newInstance() {
        SocketManager._instance = new SocketManager()
        return SocketManager._instance
    }

    private _socket: Socket
    private _eventsManager: EventsManager
    constructor() {
        this._eventsManager = EventsManager.instance
        const emitsHandler = {
            [SocketEvents.HI]: this._hi.bind(this),
            [SocketEvents.CREATE_ROOM]: this._createRoom.bind(this),
            [SocketEvents.JOIN_ROOM]: this._joinRoom.bind(this),
            [SocketEvents.SEND_MESSAGE]: this._sendMessage.bind(this),
            [SocketEvents.SEND_SCENARIO]: this._sendScenario.bind(this),
            [SocketEvents.LEAVE_ROOM]: this._leaveRoom.bind(this),
            [SocketEvents.NEW_PLAYER_REGISTER]: this._newPlayerRegister.bind(this),
            [SocketEvents.END_GAME]: this._endGame.bind(this),
            [SocketEvents.FEEDBACK]: this._feedback.bind(this),
            [SocketEvents.REQUEST_SCENARIOS]: this._requestScenarios.bind(this),
            [SocketEvents.UPDATE_CHARACTER_SHEET]: this._updateCharacterSheet.bind(this)
        }

        const onsHandler = {
            [SocketEvents.HELLO]: this._hello.bind(this),
            [SocketEvents.ROOM_CREATED]: this._roomCreated.bind(this),
            [SocketEvents.DM_CHANGED]: this._dmChanged.bind(this),
            [SocketEvents.PLAYER_DATA]: this._playerData.bind(this),
            [SocketEvents.ROOM_JOINED]: this._roomJoined.bind(this),
            [SocketEvents.MESSAGE]: this._message.bind(this),
            [SocketEvents.SCENARIO]: this._scenario.bind(this),
            [SocketEvents.SCENARIO_GUIDE]: this._scenarioGuide.bind(this),
            [SocketEvents.ERROR]: this._error.bind(this),
            [SocketEvents.PLAYER_LEFT]: this._playerLeft.bind(this),
            [SocketEvents.PLAYER_JOINED]: this._playerJoined.bind(this),
            [SocketEvents.NEW_PLAYER]: this._newPlayer.bind(this),
            [SocketEvents.GAME_ENDED]: this._gameEnded.bind(this),
            [SocketEvents.SCENARIO_LIST]: this._scenarioList.bind(this),
            [SocketEvents.CHARACTER_SHEET_UPDATED]: this._characterSheetUpdated.bind(this)
        }

        Object.entries(emitsHandler).forEach(([key, value]) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this._eventsManager.on(key, 'socket-manager', value)
        )

        this._socket = io(endpoint)
        this._socket.on(SocketEvents.CONNECTED, this._connected.bind(this))
        Object.entries(onsHandler).forEach(([key, value]) => this._socket.on(key, value))
    }

    private _connect() {
        if (!this._socket) {
            this._socket = io(endpoint)
        }
    }

    private _connected() {
        this._eventsManager.trigger(SocketEvents.CONNECTED, {})
    }

    //#region emits
    private _hi() {
        this._socket.emit(SocketEvents.HI, {})
    }

    private _createRoom(player: Partial<PlayerDump>) {
        this._socket.emit(SocketEvents.CREATE_ROOM, player)
    }

    private _joinRoom({ id, userId, data }: any) {
        this._socket.emit(SocketEvents.JOIN_ROOM, id, userId, data)
    }

    private _sendMessage(params: {
        id: string
        username: string
        playername: string
        message: string
        target?: string
    }) {
        this._socket.emit(
            SocketEvents.SEND_MESSAGE,
            params.id,
            params.username,
            params.playername,
            params.message,
            params.target
        )
    }

    private _sendScenario({ id, username, message }: any) {
        this._socket.emit(SocketEvents.SEND_SCENARIO, id, username, message)
    }

    private _leaveRoom({ id, userId, username }: any) {
        this._socket.emit(SocketEvents.LEAVE_ROOM, id, userId, username)
    }

    private _newPlayerRegister({ roomId, data }: { roomId: string; data: PlayerDump }) {
        this._socket.emit(SocketEvents.NEW_PLAYER_REGISTER, roomId, data)
    }

    private _endGame({ roomId, userId }: { roomId: string; userId: string }) {
        this._socket.emit(SocketEvents.END_GAME, roomId, userId)
    }

    private _feedback({ roomId, score, scenarios }: { roomId: string; score: number; scenarios: Scenario[] }) {
        this._socket.emit(SocketEvents.FEEDBACK, roomId, score, scenarios)
    }

    private _requestScenarios({ roomId }: { roomId: string }) {
        this._socket.emit(SocketEvents.REQUEST_SCENARIOS, roomId)
    }

    private _updateCharacterSheet({
        roomId,
        userId,
        sheet
    }: {
        roomId: string
        userId: string
        sheet: CharacterSheet
    }) {
        this._socket.emit(SocketEvents.UPDATE_CHARACTER_SHEET, roomId, userId, sheet)
    }

    //#endregion

    //#region ons
    private _hello() {
        this._eventsManager.trigger(SocketEvents.HELLO, {})
    }

    private _roomCreated(id: string, playerList: Partial<PlayerDump>[]) {
        this._eventsManager.trigger(SocketEvents.ROOM_CREATED, { id, playerList })
    }

    private _dmChanged(playerid: string) {
        this._eventsManager.trigger(SocketEvents.DM_CHANGED, { playerid })
    }

    private _playerData(player: PlayerDump) {
        this._eventsManager.trigger(SocketEvents.PLAYER_DATA, player)
    }

    private _roomJoined(player: PlayerDump, playerlist: Partial<PlayerDump>[]) {
        this._eventsManager.trigger(SocketEvents.ROOM_JOINED, { player, playerlist })
    }

    private _message(username: string, message: string, playername: string, target: string) {
        this._eventsManager.trigger(SocketEvents.MESSAGE, { username, message, playername, target })
    }

    private _scenario(message: string) {
        this._eventsManager.trigger(SocketEvents.SCENARIO, { message })
    }

    private _scenarioGuide(username: string, organized: any, theme: string) {
        this._eventsManager.trigger(SocketEvents.SCENARIO_GUIDE, { username, organized, theme })
    }

    private _error(where: string, message: string, error: any) {
        this._eventsManager.trigger(SocketEvents.ERROR, { where, message, error })
    }

    private _playerLeft(playerId: string) {
        this._eventsManager.trigger(SocketEvents.PLAYER_LEFT, { playerId })
    }

    private _playerJoined(player: PlayerDump) {
        this._eventsManager.trigger(SocketEvents.PLAYER_JOINED, player)
    }

    private _newPlayer(playerId: string) {
        this._eventsManager.trigger(SocketEvents.NEW_PLAYER, { id: playerId })
    }

    private _gameEnded(userId: string) {
        this._eventsManager.trigger(SocketEvents.GAME_ENDED, { userId })
    }

    private _scenarioList(scenarios: Scenario[]) {
        this._eventsManager.trigger(SocketEvents.SCENARIO_LIST, { scenarios })
    }

    private _characterSheetUpdated(userId: string, sheet: CharacterSheet) {
        this._eventsManager.trigger(SocketEvents.CHARACTER_SHEET_UPDATED, { userId, sheet })
    }

    //#endregion
}
