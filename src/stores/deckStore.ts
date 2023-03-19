import { defineStore } from 'pinia'
import { Rune } from '@src/api/poxApiDto'
import { computed, ref } from 'vue'

export type DeckRune = Rune & { deckId: string }

function generateRandomId() {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let id = ''
    for (let i = 0; i < 10; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
}

export const useDeck = defineStore('deckStore', () => {
    const deckRunes = ref<DeckRune[]>([])
    const deckLength = computed(() => deckRunes.value.length)
    const addRune = (rune: Rune) => {
        if (deckLength.value >= 30) return
        if (countRune(rune.hash) >= rune.deckLimit) return

        const newRune = JSON.parse(JSON.stringify(rune)) as DeckRune
        newRune.deckId = generateRandomId()
        deckRunes.value.push(newRune)
    }
    const removeRune = (rune: DeckRune) => {
        console.log(rune.deckId)
        deckRunes.value = deckRunes.value.filter(
            (r) => r.deckId !== rune.deckId
        )
    }
    const countRune = (hash: string) => {
        return deckRunes.value.filter((r) => r.hash === hash).length
    }

    return {
        deckRunes,
        deckLength,
        addRune,
        removeRune,
        countRune,
    }
})
