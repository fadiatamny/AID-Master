import { PlayerDump } from './Player.model'
import { Scenario } from './Scenario.model'

export interface GameDump {
    dm: PlayerDump
    originalDm: PlayerDump
    playerList: PlayerDump[]
    lastScenario: Scenario
}
