import { DeckRune } from '@src/stores/deckStore'
import { decodeBase62, encodeBase62 } from '@src/libs/deckstring/baseEncoder'

export type AbilityIndex = 0 | 1 | 2 // Only 3 abilities per level
export type DecodedAbilities = [AbilityIndex, AbilityIndex]

export const encodeAbilities = (abilities: DecodedAbilities): string => {
    const key = parseInt(abilities.join(''))
    return encodeBase62(key, false)
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
    let abilityKey = decodeBase62(char).toString()
    if (parseInt(abilityKey) < 10) abilityKey = '0' + abilityKey
    if (abilityKey !== null) {
        const [ability1, ability2] = abilityKey.split('')
        return [
            parseInt(ability1) as AbilityIndex,
            parseInt(ability2) as AbilityIndex,
        ]
    }

    return null
}
