import { DeckRune } from '@src/stores/deckStore'
import {
    decodeAbilities,
    encodeAbilities,
    getSelectedAbilities,
    setSelectedAbilities,
} from '@src/libs/deckstring/abilityEncoder'
import { decodeBase61, encodeBase61 } from '@src/libs/deckstring/baseEncoder'
import { Rune } from '@src/libs/api/poxApiDto'

export const encodeDeck = (deck: DeckRune[]): string => {
    const allChamps = deck.filter((rune) => rune.type === 'Champion')
    const allSpells = deck.filter((rune) => rune.type === 'Spell')
    const allEquips = deck.filter((rune) => rune.type === 'Equipment')
    const allRelics = deck.filter((rune) => rune.type === 'Relic')

    const seperatedRunes = [allChamps, allSpells, allEquips, allRelics]
    const seperator = '-'

    // a rune is two base62 encoded characters, example: 'A1' for id 65
    // champions also have an additional character for abilities [A-F]
    // [champs]-[spells]-[equips]-[relics]
    // example: 4QEMDEMDEEGAEGA8pB8pBN3BN3BDZD84F56A7iA7iAOEEOEEOaCOaCB4D-091K1K3I3I-2I2I15-2S6Z5M

    const runeIds = seperatedRunes.map((runes) => {
        const runeIds = runes.map((rune) => {
            const runeId = encodeBase61(rune.id)
            if (rune.type === 'Champion') {
                const abilityId = encodeAbilities(getSelectedAbilities(rune))
                return runeId + abilityId
            }
            return runeId
        })
        return runeIds.join('')
    })

    return runeIds.join(seperator)
}

export const decodeDeck = (deckString: string, allRunes: Rune[]): Rune[] => {
    const [champStr, spellStr, equipStr, relicStr] = deckString.split('-')
    const deck: Rune[] = []

    for (let i = 0; i < champStr.length; i += 3) {
        const id = decodeBase61(champStr.slice(i, i + 2))
        const runeRef = allRunes
            .filter((rune) => rune.type === 'Champion')
            .filter((rune) => rune.id === id)[0]
        const rune = JSON.parse(
            JSON.stringify({ ...runeRef, type: 'Champion' })
        ) as Rune
        if (!rune) {
            throw new Error('Decoder: Rune not found')
        }
        const abilities = decodeAbilities(champStr[i + 2])
        if (!abilities) {
            throw new Error('Decoder: Rune has no abilities')
        }
        setSelectedAbilities(rune, abilities)
        deck.push(rune)
    }

    for (const runeType of [
        { str: spellStr, type: 'Spell' },
        { str: equipStr, type: 'Equipment' },
        { str: relicStr, type: 'Relic' },
    ]) {
        for (let i = 0; i < runeType.str.length; i += 2) {
            const id = decodeBase61(runeType.str.slice(i, i + 2))
            const runeRef = allRunes
                .filter((rune) => rune.type === runeType.type)
                .filter((rune) => rune.id === id)[0]
            const rune = JSON.parse(
                JSON.stringify({ ...runeRef, type: runeType.type })
            ) as Rune
            if (!rune) {
                throw new Error('Decoder: Rune not found')
            }
            deck.push(rune)
        }
    }

    return deck
}
