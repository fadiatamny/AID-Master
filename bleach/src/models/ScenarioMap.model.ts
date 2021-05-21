const generateAilgments = () => {
    const value = 'Alignment'
    return {
        'lawful good': value,
        'lawful neutral': value,
        'lawful evil': value,
        'neutral good': value,
        neutral: value,
        'neutral evil': value,
        'chaotic good': value,
        'chaotic neutral': value,
        'chaotic evil': value
    }
}

const generateMiscAndStatus = () => {
    const value = 'Misc / Statues Condition'
    return {
        reward: value,
        loot: value,
        curse: value,
        potion: value,
        magic: value,
        trap: value,
        death: value
    }
}

const generateWeapons = () => {
    const value = 'Weapons'
    return {
        bow: value,
        staff: value,
        hammer: value,
        scemitar: value,
        shield: value,
        sword: value,
        greatsword: value,
        axe: value,
        club: value,
        dagger: value,
        greatclub: value,
        handaxe: value,
        javelin: value,
        'light hammer': value,
        mace: value,
        spear: value
    }
}

const generateRaces = () => {
    const value = 'Misc / Statues Condition'
    return {
        animal: value,
        'demi-human': value,
        werewolf: value,
        'half-beast': value,
        vampire: value,
        beast: value,
        dragonborn: value,
        dragon: value,
        dwarf: value,
        giant: value,
        elf: value,
        'half-elf': value,
        halfling: value,
        gnome: value,
        'half-orc': value,
        human: value,
        tiefling: value,
        orc: value,
        leonin: value,
        satyr: value,
        aarakccra: value,
        genasi: value,
        goliath: value,
        goblin: value,
        hobgoblin: value,
        lizardfolk: value,
        miotaur: value,
        kobold: value
    }
}

const generateGeneralTime = () => {
    const value = 'General Time'
    return {
        night: value,
        day: value
    }
}

const generateTimeOfDay = () => {
    const value = 'Time Of Day'
    return {
        dawn: value,
        dusk: value,
        morning: value,
        noon: value,
        evening: value
    }
}

const generateSettings = () => {
    const value = 'Setting'
    return {
        garden: value,
        woods: value,
        mountains: value,
        heaven: value,
        hell: value,
        ship: value,
        hideout: value,
        swamp: value,
        desert: value,
        jungle: value,
        pyramid: value,
        home: value,
        farm: value,
        barn: value,
        maze: value,
        castle: value,
        prison: value,
        graveyard: value,
        crypt: value,
        cave: value,
        tavern: value,
        shop: value,
        sea: value,
        city: value,
        town: value,
        village: value
    }
}

const generateActions = () => {
    const value = 'Actions'
    return {
        battle: value,
        travel: value,
        escape: value,
        chase: value,
        puzzle: value,
        arguement: value,
        conversation: value,
        invstigate: value,
        haggle: value,
        trade: value
    }
}

const generateGeneralMood = () => {
    const value = 'General Mood'
    return {
        neutral: value,
        friendly: value,
        intense: value,
        relaxed: value,
        peaceful: value,
        stressful: value,
        sad: value,
        scary: value,
        aggresive: value
    }
}

const generateDmActions = () => {
    const value = 'DM Actions'
    return {
        roll: value,
        'tackle party': value,
        'divide party': value
    }
}

const generateEncounterType = () => {
    const value = 'Encounter Type'
    return {
        'special encounter': value,
        'exposition encounter': value,
        'combat encounter': value,
        'boss encounter': value,
        'exploration encounter': value
    }
}

const ScenarioMap: Record<string, string> = {
    ...generateAilgments(),
    ...generateMiscAndStatus(),
    ...generateWeapons(),
    ...generateRaces(),
    ...generateGeneralTime(),
    ...generateTimeOfDay(),
    ...generateSettings(),
    ...generateActions(),
    ...generateGeneralMood(),
    ...generateDmActions(),
    ...generateEncounterType()
}

export default ScenarioMap
