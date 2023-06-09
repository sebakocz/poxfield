<template>
    <div class="h-full overflow-y-auto">
        <div v-if="!deckStore.deckLength" class="mt-20 p-2 text-center text-xl">
            Add cards to your deck to see them here!
        </div>
        <div v-else class="flex flex-col items-center p-2 lg:mr-3">
            <!-- Settings -->
            <div
                class="my-3 flex w-full flex-wrap justify-center px-2 text-xs sm:justify-between sm:text-base"
            >
                <div class="mb-2 flex gap-2">
                    <button
                        class="rounded-md bg-red-600 p-2 text-white"
                        @click="clearDeck"
                    >
                        Clear
                    </button>
                    <button
                        class="rounded-md bg-blue-600 p-2 text-white"
                        @click="copyToClipboard"
                    >
                        Copy to clipboard!
                    </button>
                </div>
                <div class="flex">
                    <div
                        v-for="(options, category) in displayOptions"
                        :key="category"
                        class="flex w-1/3 items-center lg:w-fit"
                    >
                        <label :for="category" class="mr-1 font-semibold">
                            {{ category }}
                        </label>
                        <select
                            :id="category"
                            v-model="selectedOptions[category]"
                            class="mr-1 w-full rounded border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            @change="saveSelectedOptions"
                        >
                            <option
                                v-for="option in options"
                                :key="option"
                                :value="option"
                            >
                                {{ option }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <!-- Deck Display -->
            <div
                class="bg-gray-300 p-2"
                :class="{
                    'md:w-[75%]': selectedOptions.View === 'Icons',
                    'w-[99%]':
                        selectedOptions.View === 'Frames' ||
                        selectedOptions.View === 'Stacks',
                }"
            >
                <template
                    v-for="(group, groupIndex) in displayedRunes"
                    :key="'group-' + groupIndex"
                >
                    <div
                        v-if="group.title"
                        class="w-full text-center font-semibold"
                    >
                        {{ group.title }} ({{ group.runes.length }})
                    </div>
                    <TransitionGroup
                        name="smooth-resize"
                        tag="div"
                        class="flex flex-wrap items-center justify-center gap-2"
                        :class="{
                            'mb-[180px] flex w-full flex-col flex-wrap content-center items-center md:max-h-[500px]':
                                selectedOptions.View === 'Stacks',
                        }"
                    >
                        <Component
                            :is="selectedViewComponent"
                            v-for="rune in group.runes"
                            :key="rune.deckId"
                            :rune="rune"
                            class="cursor-pointer duration-200 hover:scale-105"
                            :class="{
                                '-mb-44': selectedOptions.View === 'Stacks',
                            }"
                            @click="selectRune(rune, true, rune.deckId)"
                            @contextmenu.prevent="removeRune(rune)"
                        />
                    </TransitionGroup>
                </template>
            </div>
            <!-- Nora Cost Chart -->
            <NoraCostChart />
        </div>
    </div>
</template>

<script setup lang="ts">
import RuneDisplayMedium from '@src/components/RuneDisplayMedium.vue'
import RuneDisplaySmall from '@src/components/RuneDisplaySmall.vue'
import { DeckRune, useDeck } from '@src/stores/deckStore'
import { useInfo } from '@src/stores/infoStore'
import NoraCostChart from '@src/components/NoraCostChart.vue'
import { encodeDeck } from '@src/libs/deckstring/deckEncoder'
import { computed, onBeforeMount, reactive } from 'vue'

const deckStore = useDeck()
const { selectRune } = useInfo()

const displayedRunes = computed(() => {
    let runes = deckStore.sortedRunes.slice()

    runes = applyGrouping(runes, selectedOptions.Group)

    if (selectedOptions.Sort !== 'Type') {
        runes.forEach((group) => {
            group.runes.sort((a, b) => {
                if (selectedOptions.Sort === 'Name') {
                    return a.name.localeCompare(b.name)
                } else if (selectedOptions.Sort === 'Cost') {
                    return a.noraCost - b.noraCost
                }
                return 0
            })
        })
    }

    return runes
})

function groupRunes(runes: DeckRune[], groupBy: string) {
    const groups = {}

    runes.forEach((rune) => {
        let groupKey = rune[groupBy]
        if (groupKey === undefined) {
            groupKey = 'Other'
        }

        if (Array.isArray(groupKey)) {
            groupKey = groupKey[0]
        }

        if (!groups[groupKey]) {
            groups[groupKey] = []
        }

        groups[groupKey].push(rune)
    })

    return Object.entries(groups)
        .map(([key, group]) => {
            return {
                title: key,
                runes: group,
            }
        })
        .sort((a, b) => {
            if (a.title === 'Other') return 1
            if (b.title === 'Other') return -1
            return a.title.localeCompare(b.title)
        })
}

function applyGrouping(runes: DeckRune[], groupBy: string) {
    if (groupBy === 'None') {
        return [
            {
                title: '',
                runes,
            },
        ]
    }

    return groupRunes(runes, groupBy.toLowerCase())
}

const displayOptions = {
    View: ['Icons', 'Frames', 'Stacks'],
    Group: ['None', 'Type', 'Factions', 'Races'],
    Sort: ['Type', 'Name', 'Cost'],
}

const selectedOptions = reactive({
    View: displayOptions.View[0],
    Group: displayOptions.Group[0],
    Sort: displayOptions.Sort[0],
})

onBeforeMount(() => {
    loadSelectedOptions()
})

function saveSelectedOptions() {
    localStorage.setItem('displayOptions', JSON.stringify(selectedOptions))
}

const selectedViewComponent = computed(() => {
    switch (selectedOptions.View) {
        case 'Icons':
            return RuneDisplaySmall
        case 'Frames':
        case 'Stacks':
            return RuneDisplayMedium
        default:
            return ''
    }
})

function loadSelectedOptions() {
    const storedOptions = localStorage.getItem('displayOptions')
    if (!storedOptions) return
    const savedOptions = JSON.parse(storedOptions)
    if (savedOptions) {
        Object.assign(selectedOptions, savedOptions)
    }
}

const copyToClipboard = () => {
    const deckString = encodeDeck(
        JSON.parse(JSON.stringify(deckStore.deckRunes)) as DeckRune[]
    )
    const fullLink =
        window.location.origin +
        import.meta.env.BASE_URL +
        '?deck=' +
        deckString
    navigator.clipboard.writeText(fullLink)
}

const clearDeck = () => {
    deckStore.clearDeck()
}

const removeRune = (rune: DeckRune) => {
    deckStore.removeRune(rune)
}
</script>
