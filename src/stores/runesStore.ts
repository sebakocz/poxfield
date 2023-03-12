import { defineStore } from 'pinia'
import { Champion, Equipment, Relic, Spell } from '@src/poxApiDto'

export type RunesStore = {
    champions: Champion[]
    equipment: Equipment[]
    relics: Relic[]
    spells: Spell[]
}

export const useRunesStore = defineStore({
    id: 'runesStore',
    state: (): RunesStore => ({
        champions: [],
        equipment: [],
        relics: [],
        spells: [],
    }),
})
