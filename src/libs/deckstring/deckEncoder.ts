import { DeckRune } from '@src/stores/deckStore'
import {
    decodeAbilities,
    DecodedAbilities,
    encodeAbilities,
    getSelectedAbilities,
} from '@src/libs/deckstring/abilityEncoder'
import { decodeBase62, encodeBase62 } from '@src/libs/deckstring/baseEncoder'
import { Rune } from '@src/libs/api/poxDto'
import { deepCopy } from '@src/libs/misc'
import { setAbility } from '@src/libs/rune'

// a rune is two base62 encoded characters, example: 'A1' for id 65
// champions also have an additional character for abilities (also base62 encoded '11' -> 'A')
// [champs]-[spells]-[equips]-[relics]+-9
// example: 4QEMDEMDEEGAEGA8pB8pBN3BN3BDZD84F56A7iA7iAOEEOEEOaCOaCB4D-091K1K3I3I-2I2I15-2S6Z5M

// Function to encode a deck of DeckRune objects into a string representation.
// The string representation consists of sections for champions, spells, equipment, and relics,
// separated by hyphens. Each rune is encoded using Base62, and champions have an additional
// character for their abilities.
export const encodeDeck = (deck: DeckRune[]): string => {
    const runeIds = {
        Champion: '',
        Spell: '',
        Equipment: '',
        Relic: '',
    }

    // Iterate through each rune in the deck and encode its ID and ability (if applicable)
    deck.forEach((rune) => {
        const runeId = encodeBase62(rune.id)
        let encodedRune

        if (rune.type === 'Champion') {
            const abilityId = encodeAbilities(getSelectedAbilities(rune))
            encodedRune = runeId + abilityId
        } else {
            encodedRune = runeId
        }

        runeIds[rune.type] += encodedRune
    })

    // Join the encoded rune IDs for each type with hyphens
    return [
        runeIds.Champion,
        runeIds.Spell,
        runeIds.Equipment,
        runeIds.Relic,
    ].join('-')
}

// Function to decode a deck string back into an array of Rune objects.
// The input deckString is a hyphen-separated string containing the encoded rune IDs for champions,
// spells, equipment, and relics.
export const decodeDeck = (deckString: string, allRunes: Rune[]): Rune[] => {
    const [champStr, spellStr, equipStr, relicStr] = deckString.split('-')
    const deck: Rune[] = []

    // Helper function to find a rune by ID and type
    const getRuneByIdAndType = (id: number, type: string): Rune | undefined =>
        allRunes.find((rune) => rune.type === type && rune.id === id)

    // Decode champions and their abilities
    for (let i = 0; i < champStr.length; i += 3) {
        const id = decodeBase62(champStr.slice(i, i + 2))
        const runeRef = getRuneByIdAndType(id, 'Champion')
        if (!runeRef) throw new Error('Decoder: Rune not found')
        const rune = deepCopy({ ...runeRef, type: 'Champion' }) as Rune

        const [ability1, ability2] = decodeAbilities(
            champStr[i + 2]
        ) as DecodedAbilities
        setAbility(rune, 0, ability1)
        setAbility(rune, 1, ability2)

        deck.push(rune)
    }

    // Decode spells, equipment, and relics
    for (const runeType of [
        { str: spellStr, type: 'Spell' },
        { str: equipStr, type: 'Equipment' },
        { str: relicStr, type: 'Relic' },
    ]) {
        for (let i = 0; i < runeType.str.length; i += 2) {
            const id = decodeBase62(runeType.str.slice(i, i + 2))
            const runeRef = getRuneByIdAndType(id, runeType.type)

            // If the rune is not found, throw an error
            if (!runeRef)
                throw new Error(
                    `Decoder: Rune not found, type: ${runeType.type} id: ${id}`
                )

            // Create a deep copy of the rune and set its type
            const rune = deepCopy({ ...runeRef, type: runeType.type }) as Rune
            deck.push(rune)
        }
    }

    // Return the decoded deck
    return deck
}
