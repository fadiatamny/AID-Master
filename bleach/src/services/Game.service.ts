import axios from 'axios'
import uniqid from 'uniqid'
import { Server, Socket } from 'socket.io'
import { GameDump, GameSession } from '../models/GameSession.model'
import ScenarioUtils from '../utils/Scenario.utils'
import { Player, PlayerType } from '../models/Player.model'

export default class GameService {
    private static _instance: GameService
    private static _activeGames: Record<string, GameSession> = {}

    public static init(io: Server, socket: Socket) {
        if (!GameService._instance) {
            GameService._instance = new GameService(io, socket)
        }
    }

    public static get instance() {
        return GameService._instance
    }

    public static getGameSession(id: string) {
        return GameService._activeGames[id]
    }

    constructor(private io: Server, private _socket: Socket) {
        const emitsHandler = {
            ['connected']: this._connected.bind(this)
        }
        const onsHandler = {
            ['createRoom']: this._createRoom.bind(this),
            ['joinRoom']: this._joinRoom.bind(this),
            ['sendMessage']: this._sendMessage.bind(this),
            ['sendScenario']: this._sendScenario.bind(this),
            ['leaveRoom']: this._leaveRoom.bind(this)
        }

        Object.entries(emitsHandler).forEach(([key, value]) => this._socket.emit(key, value))
        Object.entries(onsHandler).forEach(([key, value]) => this._socket.on(key, value))
    }

    private get rooms() {
        return this.io.sockets.adapter.rooms
    }

    public getGame(roomId: string) {
        return GameService._activeGames[roomId]
    }

    private _connected() {
        return { message: 'You are connected!' }
    }

    private _onGameEnd(roomId: string) {
        delete GameService._activeGames[roomId]
    }

    private _createRoom(pId: string, username: string, data?: GameDump) {
        const id = uniqid()
        if (data) {
            GameService._activeGames[id.toString()] = GameSession.fromDump(data)
        } else {
            const dm = new Player(PlayerType.DM, pId, username)
            GameService._activeGames[id.toString()] = new GameSession(dm, this._onGameEnd)
        }
        this._socket.join(id.toString())
        this._socket.emit('roomCreated', id.toString())
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
                    this._socket.emit('dmChanged', playerId)
                }
                let playerData = session.getPlayer(playerId)
                if (!playerData && data) {
                    session.addPlayer(data)
                    playerData = data
                } else {
                    session.playerReconnect(playerId)
                    this.io.sockets.in(roomId).emit('playerData', playerId, playerData)
                }
                this._socket.join(roomId)
                this.io.sockets.in(roomId).emit('roomJoined', playerData!.username, playerData!.type)
            } else {
                this._sendError('There was an issue, please try again', `This room ${roomId} does not exist.`)
            }
        } catch (err) {
            console.log(err.message)
            this._sendError('There was an issue, please try again', err)
        }
    }

    private _sendMessage(roomId: string, username: string, message: string, target?: string) {
        if (!roomId || !username || !message) {
            this._sendError('There was an issue, please try again', 'Missing Variables')
            return
        }
        this.io.sockets.in(roomId).emit('message', username, message, target)
    }

    private _sendScenario(roomId: string, username: string, scenario: string) {
        if (!this._roomExists(roomId)) {
            this._sendError('There was an issue, please try again', 'Room doesnt exist')
            return
        }

        this.io.sockets.in(roomId).emit('scenario', scenario)
        axios
            .post(`${process.env.AMNESIA_ENDPOINT}/api/predict`, {
                text: scenario
            })
            .then((res) => {
                const session = this.getGame(roomId)
                session.newScenario(scenario, res.data)
                const organized = ScenarioUtils.organizeByCategory(res.data)
                const theme = ScenarioUtils.fetchTheme(res.data)
                this.io.sockets.in(roomId).emit('scenarioGuide', username, organized, theme)
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
        this.io.sockets.in(roomId).emit('message', 'Server', `${playerId} has left the game`)
        session.playerLeft(playerId)
        this._socket.leave(roomId)
    }

    private _sendError(message?: string, error?: unknown) {
        this._socket.emit('error', {
            message: message ?? `There was an issue`,
            error
        })
    }
}