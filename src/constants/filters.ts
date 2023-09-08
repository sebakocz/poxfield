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
        | 'artist'
    possibleValues: string[]
    query: string
}

export type NumberFilter = {
    label: string
    key:
        | 'noraCost'
        | 'damage'
        | 'defense'
        | 'hitPoints'
        | 'speed'
        | 'minRng'
        | 'maxRng'
    condition: 'moreThan' | 'lessThan' | 'moreOrEqual' | 'lessOrEqual' | 'equal'
    query: number
}

export type EffectFilter = {
    label: string
    key: 'effect'
    possibleValues: string[]
    query: string
}

export const categoryFilters: CatagoryFilter[] = [
    {
        label: 'Type',
        key: 'type',
        possibleValues: ['Champion', 'Equipment', 'Relic', 'Spell'],
        query: '',
    },
    {
        label: 'Faction',
        key: 'factions',
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
        label: 'Class',
        key: 'classes',
        possibleValues: [],
        query: '',
    },
    {
        label: 'Size',
        key: 'size',
        possibleValues: ['1x1', '2x2'],
        query: '',
    },
    {
        label: 'Rarity',
        key: 'rarity',
        possibleValues: ['COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY', 'EXOTIC'],
        query: '',
    },
    {
        label: 'Set',
        key: 'runeSet',
        possibleValues: [],
        query: '',
    },
    {
        label: 'Artist',
        key: 'artist',
        possibleValues: [],
        query: '',
    },
]

export const numberFilters: NumberFilter[] = [
    {
        label: 'Nora Cost',
        key: 'noraCost',
        condition: 'moreOrEqual',
        query: 0,
    },
    {
        label: 'Damage',
        key: 'damage',
        condition: 'moreOrEqual',
        query: 0,
    },
    {
        label: 'Defense',
        key: 'defense',
        condition: 'moreOrEqual',
        query: 0,
    },
    {
        label: 'Hit Points',
        key: 'hitPoints',
        condition: 'moreOrEqual',
        query: 0,
    },
    {
        label: 'Speed',
        key: 'speed',
        condition: 'moreOrEqual',
        query: 0,
    },
    {
        label: 'Min Range',
        key: 'minRng',
        condition: 'moreOrEqual',
        query: 0,
    },
    {
        label: 'Max Range',
        key: 'maxRng',
        condition: 'moreOrEqual',
        query: 0,
    },
]

export const effectFilters: EffectFilter[] = [
    {
        label: 'Ability',
        key: 'effect',
        possibleValues: [],
        query: '',
    },
]
