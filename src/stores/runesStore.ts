import { defineStore } from 'pinia'
import { Champion, Equipment, Relic, Spell } from '@src/poxApiDto'

export type RunesStore = {
    allChampions: Champion[]
    allEquipments: Equipment[]
    allRelics: Relic[]
    allSpells: Spell[]
}

export const useRunes = defineStore({
    id: 'runesStore',
    state: (): RunesStore => ({
        allChampions: [],
        allEquipments: [],
        allRelics: [],
        allSpells: [],
    }),
    getters: {
        allRunes(): Champion[] | Equipment[] | Relic[] | Spell[] {
            return [
                ...this.allChampions,
                ...this.allEquipments,
                ...this.allRelics,
                ...this.allSpells,
            ]
        },
    },
})
