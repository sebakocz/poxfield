// Define the types for the abilities and the encoded string
import { DeckRune } from '@src/stores/deckStore'
import { Rune } from '@src/libs/api/poxApiDto'

type AbilityIndex = 0 | 1 | 2 // only 3 abilities per level
type EncodedAbilities = keyof typeof ABILITY_MAPPING

// Define the type for the decoded abilities
type DecodedAbilities = [AbilityIndex, AbilityIndex]

// Define a mapping between each combination of abilities and a single character
const ABILITY_MAPPING = {
    '00': 'A',
    '01': 'B',
    '02': 'C',
    '11': 'D',
    '12': 'E',
    '22': 'F',
}

// Encode a combination of abilities into a single character
export const encodeAbilities = (abilities: [AbilityIndex, AbilityIndex]) => {
    const key = abilities.sort().join('') as EncodedAbilities
    return ABILITY_MAPPING[key]
}

export const getSelectedAbilities = (
    rune: DeckRune
): [AbilityIndex, AbilityIndex] => {
    if (rune.type !== 'Champion') {
        console.dir(rune)
        throw new Error('Encoder: Rune is not a champion')
    }
    const getAbility = (index: 0 | 1) =>
        rune.abilitySets &&
        rune.abilitySets[index] &&
        (rune.abilitySets[index].abilities.findIndex(
            (ability) => ability.selected
        ) as AbilityIndex | -1)

    const ability1 = getAbility(0)
    const ability2 = getAbility(1)

    if (
        ability1 === undefined ||
        ability2 === undefined ||
        ability1 === -1 ||
        ability2 === -1
    ) {
        console.dir(rune)
        throw new Error('Encoder: Rune has no selected abilities:')
    }

    return [ability1, ability2]
}

export const setSelectedAbilities = (
    rune: Rune,
    abilities: DecodedAbilities
) => {
    if (rune.type !== 'Champion') {
        console.dir(rune)
        throw new Error('Encoder: Rune is not a champion')
    }
    const [ability1, ability2] = abilities
    if (rune.abilitySets) {
        // for each ability in set
        rune.abilitySets[0].abilities.forEach((ability, i) => {
            // remove nora cost of previous ability
            // add nora cost of selected ability
            const selected = i === ability1
            if (ability.selected) rune.noraCost -= ability.noraCost
            ability.selected = selected
            if (ability.selected) rune.noraCost += ability.noraCost
        })
        rune.abilitySets[1].abilities.forEach((ability, i) => {
            // remove nora cost of previous ability
            // add nora cost of selected ability
            const selected = i === ability2
            if (ability.selected) rune.noraCost -= ability.noraCost
            ability.selected = selected
            if (ability.selected) rune.noraCost += ability.noraCost
        })
    }
}

// Decode a single character back into the combination of abilities
export const decodeAbilities = (char: string): DecodedAbilities | null => {
    if (char.length !== 1) {
        return null
    }
    for (const key in ABILITY_MAPPING) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (ABILITY_MAPPING[key] === char) {
            const [ability1, ability2] = key
                .split('')
                .map((ability) => parseInt(ability) as AbilityIndex)
            return [ability1, ability2]
        }
    }
    return null
}
