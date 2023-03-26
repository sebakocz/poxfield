<template>
    <div class="flex h-16 w-full gap-2">
        <div
            v-for="route in navRoutes"
            :key="route.name"
            class="flex w-full items-center justify-center rounded-t bg-gray-200 p-3 text-xl sm:duration-200"
            :class="{
                'mt-auto h-14 cursor-pointer bg-gray-50 hover:h-16 hover:bg-gray-300':
                    currentRouteIndex !== navRoutes.indexOf(route),
                'h-16': currentRouteIndex === navRoutes.indexOf(route),
            }"
            @click="currentRouteIndex = navRoutes.indexOf(route)"
        >
            {{
                route.name === 'Runes' &&
                !isMobile &&
                runesStore.allRunes.length
                    ? `Runes (${runesStore.filteredList.length}/${runesStore.allRunes.length})`
                    : route.name
            }}
            <transition name="fade">
                <div
                    v-if="
                        route.name === 'Filter' &&
                        runesStore.activeFilterKeys.length
                    "
                    class="ml-1 rounded-full bg-blue-600 py-0.5 px-1.5 text-xs font-semibold text-white shadow duration-200"
                >
                    {{ runesStore.activeFilterKeys.length }}
                </div>
            </transition>
            <transition name="fade">
                <div
                    v-if="route.name === 'Deck' && deckStore.deckLength"
                    class="ml-1 rounded-full bg-blue-600 py-0.5 px-1.5 text-xs font-semibold text-white shadow duration-200"
                >
                    {{ deckStore.deckLength }}
                </div>
            </transition>
        </div>
    </div>
    <div class="flex-grow overflow-hidden bg-gray-200">
        <Transition name="fade">
            <RunesView v-if="currentRouteIndex === 0" key="runes" />
            <FilterView v-else-if="currentRouteIndex === 1" key="filter" />
            <DeckView v-else-if="currentRouteIndex === 2" key="deck" />
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { usePoxApi } from '@src/libs/api/poxApi'
import { onMounted, ref } from 'vue'
import { navRoutes } from '@src/constants/nav'
import RunesView from '@src/views/RunesView.vue'
import FilterView from '@src/views/FilterView.vue'
import { useRunes } from '@src/stores/runesStore'
import { useMobileCheck } from '@src/composables/mobileCheck'
import { useDeck } from '@src/stores/deckStore'
import DeckView from '@src/views/DeckView.vue'
import { decodeDeck } from '@src/libs/deckstring/deckEncoder'

const poxApi = usePoxApi()
const runesStore = useRunes()
const deckStore = useDeck()
const { isMobile } = useMobileCheck()
const currentRouteIndex = ref(0)

onMounted(async () => {
    await poxApi.loadRunes()

    if (deckStore.deckLength) return
    const deckString = new URLSearchParams(window.location.search).get('deck')
    if (deckString) {
        currentRouteIndex.value = 2
        const deck = decodeDeck(deckString, runesStore.allRunes)
        for (const rune of deck) {
            deckStore.addRune(rune)
        }
    }

    await runesStore.setupFilters()
})
</script>

<style scoped></style>
