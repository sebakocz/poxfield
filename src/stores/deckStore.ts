import { defineStore } from 'pinia'
import { Rune } from '@src/libs/api/poxDto'
import { computed, ref } from 'vue'
import { deepCopy } from '@src/libs/misc'

export type DeckRune = Rune & { deckId: string }

const generateRandomId = () => {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let id = ''
    for (let i = 0; i < 10; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
}

const typeOrder = Object.fromEntries(
    Object.entries({
        Champion: 0,
        Spell: 1,
        Equipment: 2,
        Relic: 3,
    }).sort((a, b) => a[1] - b[1])
)

export const useDeck = defineStore('deckStore', () => {
    const deckRunes = ref<DeckRune[]>([])

    // type > name > cost
    // Champion > Spell > Equipment > Relic
    const sortedRunes = computed(() =>
        [...deckRunes.value].sort(
            (
                { type: aType, name: aName, noraCost: aCost },
                { type: bType, name: bName, noraCost: bCost }
            ) =>
                typeOrder[aType] - typeOrder[bType] ||
                aName.localeCompare(bName) ||
                aCost - bCost
        )
    )

    const deckLength = computed(() => deckRunes.value.length)
    const addRune = (rune: Rune) => {
        if (deckLength.value >= 30) return
        if (countRune(rune.hash) >= rune.deckLimit) return

        const newRune = deepCopy(rune) as DeckRune
        newRune.deckId = generateRandomId()
        deckRunes.value.push(newRune)
    }
    const removeRune = (rune: DeckRune) => {
        deckRunes.value = deckRunes.value.filter(
            (r) => r.deckId !== rune.deckId
        )
    }
    const countRune = (hash: string) => {
        return deckRunes.value.filter((r) => r.hash === hash).length
    }

    const clearDeck = () => {
        deckRunes.value = []
    }

    return {
        deckRunes,
        deckLength,
        addRune,
        removeRune,
        countRune,
        sortedRunes,
        clearDeck,
    }
})
