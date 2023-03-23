import { defineStore } from 'pinia'
import { Rune } from '@src/libs/api/poxDto'
import { deepCopy } from '@src/libs/misc'

export const useInfo = defineStore({
    id: 'infoStore',
    state: () => ({
        selectedRune: null as Rune | null,
        isDeck: false,
        deckId: undefined as string | undefined,
    }),
    actions: {
        selectRune(rune: Rune, isDeck = false, deckId?: string) {
            this.deckId = deckId
            this.isDeck = isDeck
            if (isDeck) {
                this.selectedRune = rune
                return
            }

            this.selectedRune = deepCopy(rune) as Rune
        },
        clearSelectedRune() {
            this.selectedRune = null
        },
    },
})
