import { Dictionary } from './Dictionary.model'

const generateIntense = () => {
    return {
        death: 0,
        trap: 0,
        curse: 0,
        evening: 0,
        dawn: 0,
        chase: 0,
        arguement: 0,
        escape: 0,
        intense: 0,
        stressful: 0,
        scary: 0,
        aggresive: 0,
        graveyard: 0,
        haggle: 0,
        'boss encounter': 0,
        'special encounter': 0
    }
}

const generateBattle = () => {
    return {
        ...generateIntense(),
        battle: 0,
        bow: 0,
        staff: 0,
        hammer: 0,
        scemitar: 0,
        shield: 0,
        sword: 0,
        greatsword: 0,
        axe: 0,
        club: 0,
        dagger: 0,
        greatclub: 0,
        handaxe: 0,
        javelin: 0,
        'light hammer': 0,
        mace: 0,
        spear: 0,
        'boss encounter': 0,
        'combat encounter': 0
    }
}

const generateRelaxed = () => {
    return {
        morning: 0,
        noon: 0,
        dawn: 0,
        day: 0,
        garden: 0,
        home: 0,
        farm: 0,
        conversation: 0,
        trade: 0,
        neutral_mood: 0,
        friendly: 0,
        relaxed: 0,
        peaceful: 0,
        travel: 0,
        'exposition encounter': 0
    }
}

const generateMysterious = () => {
    return {
        curse: 0,
        magic: 0,
        hideout: 0,
        puzzle: 0,
        invstigate: 0,
        neutral_mood: 0,
        friendly: 0,
        'exploration encounter': 0
    }
}

const generateRewarding = () => {
    return {
        reward: 0,
        loot: 0,
        'special encounter': 0
    }
}

export const generateScenarioThemeMap = (): Record<string, Dictionary> => {
    return {
        Intense: generateIntense(),
        Battle: generateBattle(),
        Relaxed: generateRelaxed(),
        Mysterious: generateMysterious(),
        Rewarding: generateRewarding()
    }
}
