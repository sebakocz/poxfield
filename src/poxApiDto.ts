export interface Rune {
    id: number
    name: string
    description: string
    flavorText: string
    noraCost: number
    artist: string
    factions: string[]
    rarity: string
    runeSet: string
    forSale: boolean
    allowRanked: boolean
    tradeable: boolean
    hash: string
    deckLimit: number
}

export interface Champion extends Rune {
    maxRng: number
    minRng: number
    defense: number
    speed: number
    damage: number
    hitPoints: number
    size: string
    classes: string[]
    races: string[]
    startingAbilities: Ability[]
    abilitySets: AbilitySet[]
}

export type Equipment = Rune

export interface Relic extends Rune {
    defense: number
    hitPoints: number
    size: string
}

export interface Spell extends Rune {
    cooldown: number
}

export interface Ability {
    id: number
    apCost: number
    name: string
    shortDescription: string
    activationType: number
    level: number
    cooldown: number
    noraCost: number
    iconName: string
}

export interface AbilitySet {
    abilities: Ability[]
}
