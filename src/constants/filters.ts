export type CatagoryFilter = {
    label: string
    key:
        | 'classes'
        | 'races'
        | 'factions'
        | 'runeSet'
        | 'rarity'
        | 'size'
        | 'type'
    possibleValues: string[]
    query: string
}

export type NumberFilter = {
    key: 'noraCost' | 'attack' | 'defense' | 'health' | 'speed'
    condition: 'moreThan' | 'lessThan' | 'moreOrEqual' | 'lessOrEqual' | 'equal'
    query: number
}

export type EffectFilter = {
    key: 'effect'
    possibleValues: string[]
    query: string
}

export const categoryFilters: CatagoryFilter[] = [
    {
        label: 'Class',
        key: 'classes',
        possibleValues: [],
        query: '',
    },
    {
        label: 'Race',
        key: 'races',
        possibleValues: [],
        query: '',
    },
    {
        label: 'Faction',
        key: 'factions',
        possibleValues: [],
        query: '',
    },
    {
        label: 'Set',
        key: 'runeSet',
        possibleValues: [],
        query: '',
    },
    {
        label: 'Rarity',
        key: 'rarity',
        possibleValues: ['COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY', 'EXOTIC'],
        query: '',
    },
    {
        label: 'Size',
        key: 'size',
        possibleValues: ['1x1', '2x2'],
        query: '',
    },
    {
        label: 'Type',
        key: 'type',
        possibleValues: ['Champion', 'Equipment', 'Relic', 'Spell'],
        query: '',
    },
]

export const numberFilters: NumberFilter[] = [
    {
        key: 'noraCost',
        condition: 'moreOrEqual',
        query: 0,
    },
    {
        key: 'attack',
        condition: 'moreOrEqual',
        query: 0,
    },
    {
        key: 'defense',
        condition: 'moreOrEqual',
        query: 0,
    },
    {
        key: 'health',
        condition: 'moreOrEqual',
        query: 0,
    },
    {
        key: 'speed',
        condition: 'moreOrEqual',
        query: 0,
    },
]

export const effectFilters: EffectFilter[] = [
    {
        key: 'effect',
        possibleValues: [],
        query: '',
    },
]
