import { CharacterSheet } from './CharacterSheet.model'
import { Player, PlayerDump } from './Player.model'
import { Scenario } from './Scenario.model'

export interface IGameSession {
    dm: Player
    originalDm: Player
    playerList: Player[]
    playerCount: number
    scenarios: Scenario[]
}

export interface GameDump {
    dm: PlayerDump
    originalDm: PlayerDump
    playerList: PlayerDump[]
    lastScenario: Scenario
}

export class GameSession implements IGameSession {
    private _originalDmId: string
    private _activeDmId: string
    private _playerList: Player[]
    private _scenarios: Scenario[]
    private _currentPlayerCount: number
    private _playersLeft: string[]

    public static fromDump(session: GameDump, onGameEnd?: Function) {
        const dm = Player.fromDump(session.dm)
        const game = new GameSession(dm, onGameEnd)
        game._scenarios = [Object.assign({}, session.lastScenario)]
        game._playerList = session.playerList.map((p) => Player.fromDump(p))
        game._currentPlayerCount = game._playerList.length
        return game
    }

    constructor(dm: Player, private _onGameEnd?: Function) {
        this._originalDmId = dm.id
        this._activeDmId = dm.id
        this._playerList = [dm]
        this._scenarios = []
        this._playersLeft = []
        this._currentPlayerCount = 1
    }

    private _playerExists(pId: string) {
        return this._playerList.find((p) => p.id === pId)
    }

    public get dm() {
        return this._playerList.find((p) => p.id === this._activeDmId)!
    }

    public get originalDm() {
        return this._playerList.find((p) => p.id === this._originalDmId)!
    }

    public set activeDm(id: string) {
        this._activeDmId = id
    }

    public get playerList() {
        return this._playerList
    }

    public get scenarios() {
        return this._scenarios
    }

    public get playerCount() {
        return this._currentPlayerCount
    }

    public addPlayer(player: Player) {
        if (this._playerExists(player.id)) {
            throw Error('This player already exists')
        }
        this._playerList.push(player)
        ++this._currentPlayerCount
    }

    public playerReconnect(pId: string) {
        this._playersLeft = this._playersLeft.filter((p) => p !== pId)
    }

    public updatePlayerSheet(pId: string, sheet: CharacterSheet) {
        const player = this._playerList.find((p) => p.id === pId)
        if (!player) {
            throw Error('Could not find the player')
        }
        Object.assign(player.characterSheet, sheet)
    }

    public playerLeft(pId: string) {
        this._playersLeft.push(pId)
        if (this._activeDmId === pId) {
            this._activeDmId = this._playerList.find((p) => !this._playersLeft.includes(p.id))?.id ?? this._originalDmId
        }
        --this._currentPlayerCount
        if (this.playerCount <= 0 && this._onGameEnd) {
            this._onGameEnd()
        }
    }

    public newScenario(text: string, prediction: unknown) {
        this._scenarios.push({ text, prediction })
    }

    public getPlayer(pId: string) {
        return this._playerExists(pId)
    }

    public toJson() {
        return {
            dm: this.dm.toJson(),
            originalDm: this.originalDm.toJson(),
            playerList: this.playerList.map((p) => p.toJson()),
            lastScenario: Object.assign({}, this.scenarios[this.scenarios.length - 1])
        }
    }
}
