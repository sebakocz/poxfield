export type Rune = {
    id: number
    name: string
    description: string
    flavorText: string
    noraCost: number
    artist: string
    factions: string[]
    rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY' | 'EXOTIC' | 'LIMITED'
    runeSet: string
    forSale: boolean
    allowRanked: boolean
    tradeable: boolean
    hash: string
    deckLimit: number
    // Champion properties
    maxRng?: number
    minRng?: number
    defense?: number
    speed?: number
    damage?: number
    hitPoints?: number
    size?: string
    classes?: string[]
    races?: string[]
    startingAbilities?: Ability[]
    abilitySets?: AbilitySet[]
    // Relic properties
    // (Already included defense and hitPoints)
    // Spell properties
    cooldown?: number
    // Equipment properties
    // (No additional properties needed)
    // custom property not included in API but very useful
    type: 'Champion' | 'Equipment' | 'Relic' | 'Spell'
}

export type Ability = {
    default: boolean
    id: number
    apCost: number
    name: string
    shortDescription: string
    activationType: number
    level: number
    cooldown: number
    noraCost: number
    iconName: string
    selected?: boolean
}

export type AbilitySet = {
    abilities: Ability[]
}
