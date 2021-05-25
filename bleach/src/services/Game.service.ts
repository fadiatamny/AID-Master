import axios from 'axios'
import uniqid from 'uniqid'
import { Server, Socket } from 'socket.io'
import { GameDump, GameSession } from '../models/GameSession.model'
import ScenarioUtils from '../utils/Scenario.utils'
import { Player, PlayerType } from '../models/Player.model'
import { SocketEvents } from '../models/SocketEvents.model'

export default class GameService {
    private static _activeGames: Record<string, GameSession> = {}

    public static init(io: Server, socket: Socket) {
        new GameService(io, socket)
    }

    public static getGameSession(id: string) {
        return GameService._activeGames[id]
    }

    constructor(private io: Server, private _socket: Socket) {
        const emitsHandler = {
            [SocketEvents.CONNECTED]: this._connected.bind(this)
        }
        const onsHandler = {
            [SocketEvents.HI]: this._hi.bind(this),
            [SocketEvents.CREATE_ROOM]: this._createRoom.bind(this),
            [SocketEvents.JOIN_ROOM]: this._joinRoom.bind(this),
            [SocketEvents.SEND_MESSAGE]: this._sendMessage.bind(this),
            [SocketEvents.SEND_SCENARIO]: this._sendScenario.bind(this),
            [SocketEvents.LEAVE_ROOM]: this._leaveRoom.bind(this)
        }

        Object.entries(onsHandler).forEach(([key, value]) => this._socket.on(key, value))
        Object.entries(emitsHandler).forEach(([key, value]) => this._socket.emit(key, value()))
    }

    private get rooms() {
        return this.io.sockets.adapter.rooms
    }

    public getGame(roomId: string) {
        return GameService._activeGames[roomId]
    }

    private _hi() {
        this._socket.emit(SocketEvents.HELLO, { message: 'You are connected!' })
    }

    private _connected() {
        return { message: 'You are connected!' }
    }

    private _onGameEnd(roomId: string) {
        delete GameService._activeGames[roomId]
    }

    private _createRoom(pId: string, username: string, playername: string, data?: GameDump) {
        const id = uniqid()
        let dm: any
        if (data) {
            GameService._activeGames[id.toString()] = GameSession.fromDump(data)
            dm = data.playerList.find((p) => p.username === username)
        } else {
            dm = new Player(PlayerType.DM, pId, username, playername)
            GameService._activeGames[id.toString()] = new GameSession(dm, this._onGameEnd)
        }
        this._socket.join(id.toString())
        this._socket.emit(SocketEvents.ROOM_CREATED, id.toString())
        this.io.sockets.in(id.toString()).emit(SocketEvents.PLAYER_DATA, username, dm)
    }

    private _roomExists(roomId: string) {
        return this.rooms.get(roomId)
    }

    private _joinRoom(roomId: string, playerId: string, data?: Player) {
        try {
            const session = this.getGame(roomId)
            if (!session || session.playerCount <= 0) {
                throw new Error('Room is Closed')
            }

            const room = this.rooms.get(roomId)
            if (room) {
                if (session.originalDm.id === playerId) {
                    session.activeDm = playerId
                    this._socket.emit(SocketEvents.DM_CHANGED, playerId)
                }
                let playerData = session.getPlayer(playerId)
                if (!playerData && data) {
                    session.addPlayer(data)
                    playerData = data
                } else {
                    session.playerReconnect(playerId)
                    this.io.sockets.in(roomId).emit(SocketEvents.PLAYER_DATA, playerId, playerData)
                }
                this._socket.join(roomId)
                this.io.sockets.in(roomId).emit(SocketEvents.ROOM_JOINED, playerData!.username, playerData!.type)
            } else {
                this._sendError('There was an issue, please try again', `This room ${roomId} does not exist.`)
            }
        } catch (err) {
            console.log(err.message)
            this._sendError('There was an issue, please try again', err)
        }
    }

    private _sendMessage(roomId: string, username: string, message: string, target?: string) {
        if (!roomId || !username || !message ) {
            this._sendError('There was an issue, please try again', 'Missing Variables')
            return
        }
        this.io.sockets.in(roomId).emit(SocketEvents.MESSAGE, username, message, target)
    }

    private _sendScenario(roomId: string, username: string, scenario: string) {
        console.log(roomId, username, scenario)
        if (!this._roomExists(roomId)) {
            this._sendError('There was an issue, please try again', 'Room doesnt exist')
            return
        }

        this.io.sockets.in(roomId).emit(SocketEvents.SCENARIO, scenario)
        axios
            .post(`${process.env.AMNESIA_ENDPOINT}/api/predict`, {
                text: scenario
            })
            .then((res) => {
                const session = this.getGame(roomId)
                const obj = JSON.parse(res.data)
                session.newScenario(scenario, obj)

                const organized = ScenarioUtils.organizeByCategory(obj)
                const theme = ScenarioUtils.fetchTheme(obj)
                console.log(theme, organized)
                this.io.sockets.in(roomId).emit(SocketEvents.SCENARIO_GUIDE, username, organized, theme)
            })
            .catch((e) => {
                console.log(e)
            })
    }

    private _leaveRoom(roomId: string, playerId: string) {
        if (!this._roomExists(roomId)) {
            this._sendError('There was an issue, please try again', 'Room doesnt exist')
            return
        }
        const session = this.getGame(roomId)
        this.io.sockets.in(roomId).emit(SocketEvents.MESSAGE, 'Server', `${playerId} has left the game`)
        session.playerLeft(playerId)
        this._socket.leave(roomId)
    }

    private _sendError(message?: string, error?: unknown) {
        this._socket.emit(SocketEvents.ERROR, {
            message: message ?? `There was an issue`,
            error
        })
    }
}
