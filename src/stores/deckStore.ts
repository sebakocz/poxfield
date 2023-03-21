import { defineStore } from 'pinia'
import { Rune } from '@src/libs/api/poxApiDto'
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

    const sortedRunes = computed(() => {
        // type > name > noraCost
        // Champion > Spell > Equipment > Relic

        const sorted = [...deckRunes.value]
        sorted.sort((a, b) => {
            if (a.type === b.type) {
                if (a.name === b.name) {
                    return a.noraCost - b.noraCost
                }
                return a.name.localeCompare(b.name)
            }
            switch (a.type) {
                case 'Champion':
                    return -1
                case 'Spell':
                    return b.type === 'Champion' ? 1 : -1
                case 'Equipment':
                    return b.type === 'Relic' ? -1 : 1
                case 'Relic':
                    return 1
            }
        })
        return sorted
    })

    const deckLength = computed(() => deckRunes.value.length)
    const addRune = (rune: Rune) => {
        if (deckLength.value >= 30) return
        if (countRune(rune.hash) >= rune.deckLimit) return

        const newRune = JSON.parse(JSON.stringify(rune)) as DeckRune
        newRune.deckId = generateRandomId()
        deckRunes.value.push(newRune)
        deckRunes.value.sort((a, b) => a.name.localeCompare(b.name))
    }
    const removeRune = (rune: DeckRune) => {
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
        sortedRunes,
    }
})
