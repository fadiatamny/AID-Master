interface Attribute {
    current: number
    max: number
}

export interface CharacterSheet {
    name: string
    abilities: string[]
    equipment: string[]
    level: number
    life: Attribute
    mana: Attribute
    shield: Attribute
}
