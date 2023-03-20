<template>
    <div class="h-full overflow-y-auto">
        <div v-if="!deckStore.deckLength" class="mt-20 p-2 text-center text-xl">
            Add cards to your deck to see them here!
        </div>
        <div v-else class="flex flex-col items-center justify-center p-2">
            <div
                class="flex flex-wrap items-center justify-center gap-2 bg-gray-300 p-2 md:w-[70%]"
            >
                <RuneDisplaySmall
                    v-for="rune in deckStore.deckRunes"
                    :key="rune.deckId"
                    :rune="rune"
                    class="cursor-pointer duration-200 hover:scale-105"
                    @click="selectRune(rune, true, rune.deckId)"
                />
            </div>
            <NoraCostChart />
        </div>
    </div>
</template>

<script setup lang="ts">
import RuneDisplaySmall from '@src/components/RuneDisplaySmall.vue'
import { useDeck } from '@src/stores/deckStore'
import { useInfo } from '@src/stores/infoStore'
import NoraCostChart from '@src/components/NoraCostChart.vue'

const deckStore = useDeck()
const { selectRune } = useInfo()
</script>
