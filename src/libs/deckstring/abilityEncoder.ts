import { DeckRune } from '@src/stores/deckStore'

export type AbilityIndex = 0 | 1 | 2 // Only 3 abilities per level
export type DecodedAbilities = [AbilityIndex, AbilityIndex]

// Mapping of ability combinations to a single character
const ABILITY_MAPPING: Record<string, string> = {
    '00': 'A',
    '01': 'B',
    '02': 'C',
    '11': 'D',
    '12': 'E',
    '22': 'F',
    '10': 'G',
    '20': 'H',
    '21': 'I',
} as const

// Use a type assertion to bypass the circular reference issue
type EncodedAbilitiesKeys = keyof typeof ABILITY_MAPPING

export const encodeAbilities = (abilities: DecodedAbilities): string => {
    const key = abilities.sort().join('') as EncodedAbilitiesKeys
    return ABILITY_MAPPING[key]
}

export const getSelectedAbilities = (rune: DeckRune): DecodedAbilities => {
    if (rune.type !== 'Champion') {
        console.dir(rune)
        throw new Error('Encoder: Rune is not a champion')
    }

    const getAbility = (index: 0 | 1): AbilityIndex | -1 => {
        if (!rune.abilitySets || !rune.abilitySets[index]) {
            return -1
        }
        return rune.abilitySets[index].abilities.findIndex(
            (ability) => ability.selected
        ) as AbilityIndex | -1
    }

    const ability1 = getAbility(0)
    const ability2 = getAbility(1)

    if (ability1 === -1 || ability2 === -1) {
        console.dir(rune)
        throw new Error('Encoder: Rune has no selected abilities')
    }

    return [ability1, ability2]
}

export const decodeAbilities = (char: string): DecodedAbilities | null => {
    if (char.length !== 1) {
        return null
    }
    const abilityKey = Object.entries(ABILITY_MAPPING).find(
        ([_, value]) => value === char
    )?.[0]

    if (abilityKey) {
        const [ability1, ability2] = abilityKey
            .split('')
            .map((ability) => parseInt(ability) as AbilityIndex)
        return [ability1, ability2]
    }

    return null
}
