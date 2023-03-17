import { defineStore } from 'pinia'
import { Champion, Equipment, Relic, Spell } from '@src/api/poxApiDto'

export const useInfo = defineStore({
    id: 'infoStore',
    state: () => ({
        selectedRune: null as Champion | Equipment | Relic | Spell | null,
    }),
    actions: {
        selectRune(rune: Champion | Equipment | Relic | Spell) {
            this.selectedRune = rune
        },
        clearSelectedRune() {
            this.selectedRune = null
        },
    },
})
