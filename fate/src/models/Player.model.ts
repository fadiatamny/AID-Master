import { CharacterSheet } from './CharacterSheet.model'

export enum PlayerType {
    DM = 'dm',
    PLAYER = 'player'
}


export interface IPlayer {
    type: PlayerType
    id: string
    username: string
    characterSheet?: CharacterSheet
}

export interface PlayerDump {
    type: PlayerType
    id: string
    username: string
    characterSheet: CharacterSheet
}