import { defineStore } from 'pinia'
import { Champion, Equipment, Relic, Spell } from '@src/api/poxApiDto'
import { useFilter } from '@src/stores/filterStore'

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
        allRunes(): (Champion | Equipment | Relic | Spell)[] {
            return [
                ...this.allChampions,
                ...this.allEquipments,
                ...this.allRelics,
                ...this.allSpells,
            ].sort((a, b) => a.name.localeCompare(b.name))
        },
        filteredList() {
            const filters = useFilter()
            const searchTerm = filters.searchQuery.toLowerCase()

            if (!searchTerm) return this.allRunes

            const filtered: (Champion | Equipment | Relic | Spell)[] = []

            this.allRunes.forEach((rune) => {
                if (rune.name.toLowerCase().includes(searchTerm)) {
                    filtered.push(rune)
                    return
                }
                if (rune.description.toLowerCase().includes(searchTerm)) {
                    filtered.push(rune)
                    return
                }
                if (
                    'races' in rune &&
                    rune.races.some((r) => r.toLowerCase().includes(searchTerm))
                ) {
                    filtered.push(rune)
                    return
                }
                if ('abilitySets' in rune) {
                    const abilities = rune.abilitySets
                        .map((set) => set.abilities)
                        .flat()
                    if (
                        abilities.some((a) =>
                            a.name.toLowerCase().includes(searchTerm)
                        )
                    ) {
                        filtered.push(rune)
                        return
                    }
                    if (
                        abilities.some((a) =>
                            a.shortDescription
                                .toLowerCase()
                                .includes(searchTerm)
                        )
                    ) {
                        filtered.push(rune)
                        return
                    }
                }

                if ('startingAbilities' in rune) {
                    if (
                        rune.startingAbilities.some((a) =>
                            a.name.toLowerCase().includes(searchTerm)
                        )
                    ) {
                        filtered.push(rune)
                        return
                    }
                    if (
                        rune.startingAbilities.some((a) =>
                            a.shortDescription
                                .toLowerCase()
                                .includes(searchTerm)
                        )
                    ) {
                        filtered.push(rune)
                        return
                    }
                }
            })

            return filtered
        },
    },
})
