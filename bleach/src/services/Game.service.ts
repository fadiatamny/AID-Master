import axios, { AxiosError } from 'axios'
import uniqid from 'uniqid'
import { Server, Socket } from 'socket.io'
import { GameDump, GameSession } from '../models/GameSession.model'
import ScenarioUtils from '../utils/Scenario.utils'
import { Player, PlayerDump, PlayerType } from '../models/Player.model'
import { SocketEvents } from '../models/SocketEvents.model'
import { Scenario } from '../models/Scenario.model'

const AVERAGE_SCORE = process.env.AVERAGE_SCORE || 5

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
            [SocketEvents.LEAVE_ROOM]: this._leaveRoom.bind(this),
            [SocketEvents.NEW_PLAYER_REGISTER]: this._newPlayerRegister.bind(this),
            [SocketEvents.END_GAME]: this._endGame.bind(this),
            [SocketEvents.FEEDBACK]: this._feedback.bind(this),
            [SocketEvents.REQUEST_SCENARIOS]: this._requestScenarios.bind(this),
            [SocketEvents.SESSION_END]: this._sessionEnd.bind(this)
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

    private _createRoom(p: Partial<Player>, data?: GameDump) {
        if (!p.id || !p.username || !p.playername) {
            this._sendError('createRoom', 'There was an issue, please try again', 'Missing Variables')
            return
        }

        const id = uniqid()
        const dm = new Player(PlayerType.DM, p.id, p.username, p.playername)

        if (data) {
            try {
                GameService._activeGames[id.toString()] = GameSession.fromDump(dm, data, this._onGameEnd)
            } catch (e) {
                this._sendError('createRoom', 'There was an issue with the given gameDump, please try again', e.message)
            }
        } else {
            GameService._activeGames[id.toString()] = new GameSession(dm, this._onGameEnd)
        }

        const playerList = GameService._activeGames[id.toString()].playerList
        this._socket.join(id.toString())
        this._socket.emit(SocketEvents.ROOM_CREATED, id.toString(), playerList)
    }

    private _roomExists(roomId: string) {
        return this.rooms.get(roomId)
    }

    private _socketJoin(roomId: string, session: GameSession, player: Player) {
        session.playerReconnect(player.id)
        this._socket.join(roomId)

        const playerList = session.playerList.map((p) => ({
            id: p.id,
            username: p.username,
            playername: p.playername
        }))
        this.io.sockets.in(roomId).emit(SocketEvents.ROOM_JOINED, player.username, player.type, playerList)
        this.io.sockets.in(roomId).emit(SocketEvents.PLAYER_JOINED, player.toJson())
    }

    private _joinRoom(roomId: string, playerId: string) {
        if (!roomId || !playerId) {
            this._sendError('joinRoom', 'There was an issue, please try again', 'Missing Variables')
            return
        }
        if (!this._roomExists(roomId)) {
            this._sendError('joinRoom', 'There was an issue, please try again', `This room ${roomId} does not exist.`)
            return
        }
        const session = this.getGame(roomId)
        if (!session || session.playerCount <= 0) {
            this._sendError('joinRoom', 'There was an issue, please try again', 'Room is Closed')
            return
        }

        const player = session.getPlayer(playerId)
        if (!player) {
            this._socket.emit(SocketEvents.NEW_PLAYER, playerId)
            return
        }

        if (session.originalDm.id === playerId) {
            session.activeDm = playerId
            this._socket.emit(SocketEvents.DM_CHANGED, roomId, playerId)
        }

        this._socketJoin(roomId, session, player)
    }

    private _newPlayerRegister(roomId: string, data: PlayerDump) {
        if (!this._roomExists(roomId)) {
            this._sendError('joinRoom', 'There was an issue, please try again', `This room ${roomId} does not exist.`)
            return
        }
        const session = this.getGame(roomId)
        if (!session || session.playerCount <= 0) {
            this._sendError('joinRoom', 'There was an issue, please try again', 'Room is Closed')
            return
        }

        const player = Player.fromDump(data)
        session.addPlayer(player)
        this._socketJoin(roomId, session, player)
    }

    private _sendMessage(roomId: string, username: string, playername: string, message: string, target?: string) {
        if (!roomId || !username || !message || !playername) {
            this._sendError('sendMessage', 'There was an issue, please try again', 'Missing Variables')
            return
        }
        if (!this._roomExists(roomId)) {
            this._sendError('sendMessage', 'There was an issue, please try again', 'Room doesnt exist')
            return
        }
        this.io.sockets.in(roomId).emit(SocketEvents.MESSAGE, username, message, playername, target)
    }

    private _sendScenario(roomId: string, username: string, scenario: string) {
        if (!roomId || !username || !scenario) {
            this._sendError('sendScenario', 'There was an issue, please try again', 'Missing Variables')
            return
        }
        if (!this._roomExists(roomId)) {
            this._sendError('sendScenario', 'There was an issue, please try again', 'Room doesnt exist')
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
                this.io.sockets.in(roomId).emit(SocketEvents.SCENARIO_GUIDE, username, organized, theme)
            })
            .catch((e: AxiosError) => {
                console.error(e.message)
                console.log(e.stack)
                this._sendError('scenarioGuide', 'There was an issue, please try again', e.message)
            })
    }

    private _leaveRoom(roomId: string, playerId: string, username: string) {
        if (!roomId || !playerId || !username) {
            this._sendError('leaveRoom', 'There was an issue, please try again', 'Missing Variables')
            return
        }
        if (!this._roomExists(roomId)) {
            this._sendError('leaveRoom', 'There was an issue, please try again', 'Room doesnt exist')
            return
        }
        const session = this.getGame(roomId)
        this.io.sockets.in(roomId).emit(SocketEvents.MESSAGE, 'Server', `${username} has left the game`)
        this.io.sockets.in(roomId).emit(SocketEvents.PLAYER_LEFT, playerId)
        session.playerLeft(playerId)
        this._socket.leave(roomId)
    }

    private _sendError(where?: string, message?: string, error?: unknown) {
        this._socket.emit(SocketEvents.ERROR, where, message ?? `There was an issue`, error)
    }

    private _endGame(roomId: string) {
        if (!roomId) {
            this._sendError('endGame', 'There was an issue, please try again', 'Missing Variables')
            return
        }
        if (!this._roomExists(roomId)) {
            this._sendError('endGame', 'There was an issue, please try again', 'Room doesnt exist')
            return
        }

        this.io.sockets.in(roomId).emit(SocketEvents.GAME_ENDED)
    }

    private _feedback(roomId: string, score: number, scenarios: Scenario[]) {
        if (!roomId || !score) {
            this._sendError('feedback', 'There was an issue, please try again', 'Missing Variables')
            return
        }
        if (!this._roomExists(roomId)) {
            this._sendError('feedback', 'There was an issue, please try again', 'Room doesnt exist')
            return
        }

        const toSend: Scenario[] = []
        const session = this.getGame(roomId)

        if (score <= AVERAGE_SCORE) {
            toSend.push(...session.scenarios)
        }

        if (scenarios) {
            toSend.push(...scenarios)
        }

        //axios post messaage to amnesia
        axios.post(`${process.env.AMNESIA_ENDPOINT}/api/feedback`, toSend).catch((e: AxiosError) => {
            console.error(e.message)
            console.log(e.stack)
            this._sendError('feedback', 'There was an issue', e.message)
        })
    }

    private _requestScenarios(roomId: string) {
        if (!roomId) {
            this._sendError('feedback', 'There was an issue, please try again', 'Missing Variables')
            return
        }
        if (!this._roomExists(roomId)) {
            this._sendError('feedback', 'There was an issue, please try again', 'Room doesnt exist')
            return
        }

        const session = this.getGame(roomId)
        this.io.sockets.in(roomId).emit(SocketEvents.SCENARIO_LIST, session.scenarios)
    }

    private _sessionEnd(roomId: string) {
        if (!roomId) {
            this._sendError('sessionEnd', 'There was an issue, please try again', 'Missing Variables')
            return
        }
        if (!this._roomExists(roomId)) {
            this._sendError('sessionEnd', 'There was an issue, please try again', 'Room doesnt exist')
            return
        }

        this.io.sockets.in(roomId).emit(SocketEvents.SESSION_ENDED)
    }
}
