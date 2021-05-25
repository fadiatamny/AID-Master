import { CharacterSheet } from './CharacterSheet.model'

export enum PlayerType {
    DM = 'dm',
    PLAYER = 'player'
}

export interface IPlayer {
    type: PlayerType
    id: string
    username: string
    playername: string
    characterSheet?: CharacterSheet
}

export interface PlayerDump {
    type: PlayerType
    id: string
    username: string
    playername: string
    characterSheet: CharacterSheet
}

export class Player implements IPlayer {
    public static fromDump(dump: PlayerDump) {
        return new Player(dump.type, dump.id, dump.username, dump.playername, dump.characterSheet)
    }

    constructor(
        private _type: PlayerType,
        private _id: string,
        private _username: string,
        private _playername: string,
        private _characterSheet?: CharacterSheet
    ) { }

    public get type() {
        return this._type
    }

    public get id() {
        return this._id
    }

    public get username() {
        return this._username
    }

    public get playername() {
        return this._playername
    }

    public get characterSheet() {
        return this._characterSheet
    }

    public toJson() {
        return {
            id: this.id,
            username: this.username,
            type: this.type,
            characterSheet: this.characterSheet
        }
    }
}
