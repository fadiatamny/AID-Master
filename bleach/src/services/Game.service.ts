import axios from 'axios'
import uniqid from 'uniqid'
import { Server, Socket } from 'socket.io'
import { UserMode, ActiveGame } from '../models/ActiveGame.model'
import ScenarioUtils from '../utils/Scenario.utils'

export default class GameService {
    private static _instance: GameService
    private static _activeGames: Record<string, ActiveGame> = {}

    public static init(io: Server, socket: Socket) {
        if (!GameService._instance) {
            GameService._instance = new GameService(io, socket)
        }
    }

    public static instance() {
        return GameService._instance
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

    private _connected() {
        return { message: 'You are connected!' }
    }

    private _createRoom(username: string) {
        const id = uniqid()
        GameService._activeGames[id.toString()] = { username, userCount: 1 }
        this._socket.join(id.toString())
        this._socket.emit('roomCreated', id.toString())
    }

    private _joinRoom(roomId: string, username: string) {
        try {
            if (!GameService._activeGames[roomId] || GameService._activeGames[roomId].userCount <= 0) {
                throw new Error('Room is Closed')
            }
            const room = this.rooms.get(roomId)

            if (room) {
                let mode = UserMode.PLAYER
                if (GameService._activeGames[roomId].username === username) {
                    mode = UserMode.DM
                }

                ++GameService._activeGames[roomId].userCount
                this._socket.join(roomId)
                this.io.sockets.in(roomId).emit('roomJoined', username, mode)
            } else {
                this._socket.emit('error', {
                    message: `This room ${roomId} does not exist.`
                })
            }
        } catch (err) {
            console.log(err.message)
            this._socket.emit('error', {
                message: `There was an issue`,
                error: err
            })
        }
    }

    private _sendMessage(roomId: string, username: string, message: string, target?: string) {
        if (!roomId || !username || !message) {
            this._socket.emit('error', {
                message: `There was an issue`,
                error: 'Missing Variables'
            })
        }
        this.io.sockets.in(roomId).emit('message', username, message, target)
    }

    private _sendScenario(roomId: string, username: string, scenario: string) {
        this.io.sockets.in(roomId).emit('scenario', scenario)
        axios
            .post(`${process.env.AMNESIA_ENDPOINT}/api/predict`, {
                text: scenario
            })
            .then((res) => {
                const organized = ScenarioUtils.organizeByCategory(res.data)
                const theme = ScenarioUtils.fetchTheme(res.data)
                this.io.sockets.in(roomId).emit('scenarioGuide', username, organized, theme)
            })
            .catch((e) => {
                console.log(e)
            })
    }

    private _leaveRoom(roomId: string) {
        this._socket.leave(roomId)
        --GameService._activeGames[roomId].userCount
        if (GameService._activeGames[roomId].userCount <= 0) {
            this._closeRoom(roomId)
        }
    }

    private _closeRoom(roomId: string) {
        delete GameService._activeGames[roomId]
    }
}
