import { defineStore } from 'pinia'
import { Rune } from '@src/libs/api/poxDto'
import { computed, ref } from 'vue'
import {
    CatagoryFilter,
    categoryFilters,
    EffectFilter,
    effectFilters,
    NumberFilter,
    numberFilters,
} from '@src/constants/filters'
import { deepCopy } from '@src/libs/misc'

export const useRunes = defineStore('runesStore', () => {
    const allRunes = ref<Rune[]>([])

    const searchQuery = ref('')
    const categories = ref<CatagoryFilter[]>([])
    const numbers = ref<NumberFilter[]>([])
    const effects = ref<EffectFilter[]>([])

    const setupFilters = () => {
        const runes = allRunes.value
        const championRunes = runes.filter((rune) => rune.type === 'Champion')

        // categories
        const uniqueArtists = new Set<string>()
        const uniqueClasses = new Set<string>()
        const uniqueFactions = new Set<string>()
        const uniqueRaces = new Set<string>()
        const uniqueRuneSets = new Set<string>()

        // abilities
        const uniqueAbilities = new Set<string>()

        championRunes.forEach((rune) => {
            rune.abilitySets?.forEach((set) => {
                set?.abilities.forEach((ability) => {
                    uniqueAbilities.add(ability?.name)
                })
            })

            rune.startingAbilities?.forEach((ability) => {
                uniqueAbilities.add(ability?.name)
            })

            rune.classes?.forEach((cls) => {
                uniqueClasses.add(cls)
            })

            rune.races?.forEach((race) => {
                uniqueRaces.add(race)
            })
        })

        runes.forEach((rune) => {
            rune.factions.forEach((faction) => {
                uniqueFactions.add(faction)
            })

            uniqueRuneSets.add(rune.runeSet)
            uniqueArtists.add(rune.artist)
        })

        const setFilterValues = (
            filters: (EffectFilter | CatagoryFilter)[],
            key: string,
            values: Set<string>
        ) => {
            filters.filter((filter) => filter.key === key)[0].possibleValues = [
                ...values,
            ].sort()
        }

        setFilterValues(categoryFilters, 'artist', uniqueArtists)
        setFilterValues(categoryFilters, 'classes', uniqueClasses)
        setFilterValues(categoryFilters, 'factions', uniqueFactions)
        setFilterValues(categoryFilters, 'races', uniqueRaces)
        setFilterValues(categoryFilters, 'runeSet', uniqueRuneSets)

        setFilterValues(effectFilters, 'effect', uniqueAbilities)

        resetFilters()
    }
    const filterRune = (rune: Rune, searchTerm: string) => {
        if (!applyFilters(rune)) {
            return false
        }

        if (
            rune.name.toLowerCase().includes(searchTerm) ||
            rune.description.toLowerCase().includes(searchTerm)
        ) {
            return true
        }

        if (
            'races' in rune &&
            rune.races?.some((r) => r.toLowerCase().includes(searchTerm))
        ) {
            return true
        }

        const abilities = [
            ...(rune.abilitySets?.flatMap((set) => set.abilities) || []),
            ...(rune.startingAbilities || []),
        ]

        return abilities.some(
            (a) =>
                a.name.toLowerCase().includes(searchTerm) ||
                a.shortDescription.toLowerCase().includes(searchTerm)
        )
    }

    const filteredList = computed(() => {
        const searchTerm = searchQuery.value.toLowerCase()
        return allRunes.value.filter((rune) => filterRune(rune, searchTerm))
    })

    function applyCategoryFilters(rune: Rune, filters: CatagoryFilter[]) {
        return filters.every((filter) => {
            if (!filter.query) {
                return true
            }

            if (filter.key === 'type') {
                return rune.type === filter.query
            }

            return rune[filter.key]?.includes(filter.query)
        })
    }

    function applyNumberFilters(rune: Rune, filters: NumberFilter[]) {
        return filters.every((filter) => {
            if (!filter.query) return true

            const value = rune[filter.key]
            if (value === undefined) return false

            switch (filter.condition) {
                case 'moreThan':
                    return value > filter.query
                case 'lessThan':
                    return value < filter.query
                case 'moreOrEqual':
                    return value >= filter.query
                case 'lessOrEqual':
                    return value <= filter.query
                case 'equal':
                    return value === filter.query
                default:
                    return true
            }
        })
    }

    function applyEffectFilters(rune: Rune, filters: EffectFilter[]) {
        if (filters.every((filter) => !filter.query)) return true
        if (rune.type !== 'Champion') return false

        const abilities = rune.abilitySets
            ?.flatMap((set) => set.abilities)
            .concat(rune.startingAbilities ?? [])

        return filters.every((filter) => {
            if (!filter.query) {
                return true
            }

            return abilities?.some((a) => a.name === filter.query)
        })
    }

    function applyFilters(rune: Rune) {
        return (
            applyCategoryFilters(rune, categories.value) &&
            applyNumberFilters(rune, numbers.value) &&
            applyEffectFilters(rune, effects.value)
        )
    }

    function resetFilters() {
        categories.value = deepCopy(categoryFilters)
        numbers.value = deepCopy(numberFilters)
        effects.value = deepCopy(effectFilters)
        searchQuery.value = ''
    }

    const getActiveFilterKeys = (
        filters: (EffectFilter | CatagoryFilter | NumberFilter)[]
    ) => {
        return filters
            .filter((filter) => filter.query)
            .map((filter) => filter.key)
    }

    const activeFilterKeys = computed(() => {
        return [
            ...getActiveFilterKeys(categories.value),
            ...getActiveFilterKeys(numbers.value),
            ...getActiveFilterKeys(effects.value),
        ]
    })

    return {
        allRunes,
        filteredList,
        setupFilters,
        categories,
        numbers,
        effects,
        searchQuery,
        resetFilters,
        activeFilterKeys,
    }
})
