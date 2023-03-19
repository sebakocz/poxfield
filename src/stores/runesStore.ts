import { defineStore } from 'pinia'
import { Champion, Equipment, Relic, Spell } from '@src/api/poxApiDto'
import { computed, ref } from 'vue'

function getRuneType(rune: Champion | Equipment | Relic | Spell): string {
    if ('maxRng' in rune) {
        return 'Champion'
    } else if ('cooldown' in rune) {
        return 'Spell'
    } else if ('defense' in rune && 'hitPoints' in rune && 'size' in rune) {
        return 'Relic'
    } else {
        return 'Equipment'
    }
}

export type RunesStore = {
    allChampions: Champion[]
    allEquipments: Equipment[]
    allRelics: Relic[]
    allSpells: Spell[]
}

type CatagoryFilter = {
    label: string
    key:
        | 'classes'
        | 'races'
        | 'factions'
        | 'runeSet'
        | 'rarity'
        | 'size'
        | 'type'
    possibleValues: string[]
    query: string
}

type NumberFilter = {
    key: 'noraCost' | 'attack' | 'defense' | 'health' | 'speed'
    condition: 'moreThan' | 'lessThan' | 'moreOrEqual' | 'lessOrEqual' | 'equal'
    query: number
}

type EffectFilter = {
    key: 'effect'
    possibleValues: string[]
    query: string
}

const categoryFilters: CatagoryFilter[] = [
    {
        label: 'Class',
        key: 'classes',
        possibleValues: [],
        query: '',
    },
    {
        label: 'Race',
        key: 'races',
        possibleValues: [],
        query: '',
    },
    {
        label: 'Faction',
        key: 'factions',
        possibleValues: [],
        query: '',
    },
    {
        label: 'Set',
        key: 'runeSet',
        possibleValues: [],
        query: '',
    },
    {
        label: 'Rarity',
        key: 'rarity',
        possibleValues: ['COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY', 'EXOTIC'],
        query: '',
    },
    {
        label: 'Size',
        key: 'size',
        possibleValues: ['1x1', '2x2'],
        query: '',
    },
    {
        label: 'Type',
        key: 'type',
        possibleValues: ['Champion', 'Equipment', 'Relic', 'Spell'],
        query: '',
    },
]

const numberFilters: NumberFilter[] = [
    {
        key: 'noraCost',
        condition: 'moreOrEqual',
        query: 0,
    },
    {
        key: 'attack',
        condition: 'moreOrEqual',
        query: 0,
    },
    {
        key: 'defense',
        condition: 'moreOrEqual',
        query: 0,
    },
    {
        key: 'health',
        condition: 'moreOrEqual',
        query: 0,
    },
    {
        key: 'speed',
        condition: 'moreOrEqual',
        query: 0,
    },
]

const effectFilters: EffectFilter[] = [
    {
        key: 'effect',
        possibleValues: [],
        query: '',
    },
]

export const useRunes = defineStore('runesStore', () => {
    const allChampions = ref<Champion[]>([])
    const allEquipments = ref<Equipment[]>([])
    const allRelics = ref<Relic[]>([])
    const allSpells = ref<Spell[]>([])

    const searchQuery = ref('')
    const categories = ref([...categoryFilters])
    const numbers = ref([...numberFilters])
    const effects = ref([...effectFilters])

    const setupPossibleValues = (
        runes: (Champion | Equipment | Relic | Spell)[]
    ) => {
        const championRunes = runes.filter(
            (rune) => 'classes' in rune
        ) as Champion[]

        const uniqueClasses = new Set(
            championRunes.map((rune) => rune.classes).flat()
        )
        categories.value.filter(
            (filter) => filter.key === 'classes'
        )[0].possibleValues = [...uniqueClasses].sort()

        const uniqueRaces = new Set(
            championRunes.map((rune) => rune.races).flat()
        )

        categories.value.filter(
            (filter) => filter.key === 'races'
        )[0].possibleValues = [...uniqueRaces].sort()

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

    const allRunes = computed(() =>
        [
            ...allChampions.value,
            ...allEquipments.value,
            ...allRelics.value,
            ...allSpells.value,
        ].sort((a, b) => a.name.localeCompare(b.name))
    )

    const filteredList = computed(() => {
        const searchTerm = searchQuery.value.toLowerCase()

        // if (!searchTerm) return allRunes.value

        const filtered: (Champion | Equipment | Relic | Spell)[] = []

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
                        a.shortDescription.toLowerCase().includes(searchTerm)
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

    function applyFilters(rune: Champion | Equipment | Relic | Spell): boolean {
        // Category filters
        for (const filter of categories.value) {
            if (filter.query) {
                // extra for type
                if (filter.key === 'type') {
                    if (getRuneType(rune) !== filter.query) {
                        return false
                    }
                }

                // @ts-ignore
                else if (
                    !(filter.key in rune) ||
                    !rune[filter.key].includes(filter.query)
                ) {
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
                    .map((set) => set.abilities)
                    .flat()

                if (!abilities.some((a) => a.effects.includes(filter.query))) {
                    return false
                }
            }
        }

        return true
    }

    return {
        allChampions,
        allEquipments,
        allRelics,
        allSpells,
        allRunes,
        filteredList,
        setupPossibleValues,
        categories,
        numbers,
        searchQuery,
    }
})
