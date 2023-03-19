import { defineStore } from 'pinia'
import { Rune } from '@src/api/poxApiDto'
import { computed, ref } from 'vue'
import {
    categoryFilters,
    effectFilters,
    numberFilters,
} from '@src/constants/filters'

export const useRunes = defineStore('runesStore', () => {
    const allRunes = ref<Rune[]>([])

    const searchQuery = ref('')
    const categories = ref([...categoryFilters])
    const numbers = ref([...numberFilters])
    const effects = ref([...effectFilters])

    const setupPossibleValues = () => {
        const runes = allRunes.value
        const championRunes = runes.filter((rune) => rune.type === 'Champion')

        const uniqueClasses = new Set(
            championRunes.map((rune) => rune.classes).flat()
        )
        categories.value.filter(
            (filter) => filter.key === 'classes'
        )[0].possibleValues = [...uniqueClasses].sort() as string[]

        const uniqueRaces = new Set(
            championRunes.map((rune) => rune.races).flat()
        )

        categories.value.filter(
            (filter) => filter.key === 'races'
        )[0].possibleValues = [...uniqueRaces].sort() as string[]

        const uniqueFactions = new Set(
            runes.map((rune) => rune.factions).flat()
        )

        categories.value.filter(
            (filter) => filter.key === 'factions'
        )[0].possibleValues = [...uniqueFactions].sort()

        const uniqueRuneSets = new Set(runes.map((rune) => rune.runeSet))

        categories.value.filter(
            (filter) => filter.key === 'runeSet'
        )[0].possibleValues = [...uniqueRuneSets].sort()
    }

    const filteredList = computed(() => {
        const searchTerm = searchQuery.value.toLowerCase()

        const filtered: Rune[] = []

        allRunes.value.forEach((rune) => {
            if (!applyFilters(rune)) {
                return
            }

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
                rune.races?.some((r) => r.toLowerCase().includes(searchTerm))
            ) {
                filtered.push(rune)
                return
            }
            if ('abilitySets' in rune) {
                const abilities = rune.abilitySets
                    ?.map((set) => set.abilities)
                    .flat()
                if (
                    abilities?.some((a) =>
                        a.name.toLowerCase().includes(searchTerm)
                    )
                ) {
                    filtered.push(rune)
                    return
                }
                if (
                    abilities?.some((a) =>
                        a.shortDescription.toLowerCase().includes(searchTerm)
                    )
                ) {
                    filtered.push(rune)
                    return
                }
            }

            if ('startingAbilities' in rune) {
                if (
                    rune.startingAbilities?.some((a) =>
                        a.name.toLowerCase().includes(searchTerm)
                    )
                ) {
                    filtered.push(rune)
                    return
                }
                if (
                    rune.startingAbilities?.some((a) =>
                        a.shortDescription.toLowerCase().includes(searchTerm)
                    )
                ) {
                    filtered.push(rune)
                    return
                }
            }
        })

        return filtered
    })

    function applyFilters(rune: Rune) {
        // Category filters
        for (const filter of categories.value) {
            if (filter.query) {
                // extra for type
                if (filter.key === 'type') {
                    if (rune.type !== filter.query) {
                        return false
                    }
                }

                // @ts-ignore
                if (!rune[filter.key]?.includes(filter.query)) {
                    return false
                }
            }
        }

        // Number filters
        for (const filter of numbers.value) {
            // if (filter.key in rune) {
            //     return false
            // }
            // @ts-ignore
            const value = rune[filter.key]

            switch (filter.condition) {
                case 'moreThan':
                    if (value <= filter.query) return false
                    break
                case 'lessThan':
                    if (value >= filter.query) return false
                    break
                case 'moreOrEqual':
                    if (value < filter.query) return false
                    break
                case 'lessOrEqual':
                    if (value > filter.query) return false
                    break
                case 'equal':
                    if (value !== filter.query) return false
                    break
            }
        }

        // Effect filters
        for (const filter of effects.value) {
            if (filter.query && 'abilitySets' in rune) {
                const abilities = rune.abilitySets
                    ?.map((set) => set.abilities)
                    .flat()

                if (
                    !abilities?.some((a) =>
                        a.shortDescription.includes(filter.query)
                    )
                ) {
                    return false
                }
            }
        }

        return true
    }

    return {
        allRunes,
        filteredList,
        setupPossibleValues,
        categories,
        numbers,
        searchQuery,
    }
})
