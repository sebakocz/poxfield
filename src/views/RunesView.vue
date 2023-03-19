<template>
    <RuneSearchBar />
    <div
        ref="viewContainer"
        class="h-[90%] overflow-y-scroll p-2 will-change-transform"
        @scroll="onScroll"
    >
        <div
            ref="scrollContainer"
            class="flex flex-wrap content-start justify-center"
            :style="containerStyle"
        >
            <span v-if="!allRunes.length" class="spinner" />
            <p
                v-if="!visibleList.length && allRunes.length"
                class="mt-20 text-xl"
            >
                No runes found. :( <br />
                Try changing your filters.
            </p>
            <RuneDisplayMedium
                v-for="rune in visibleList"
                :key="rune.id"
                :rune="rune"
                class="cursor-pointer duration-200 hover:scale-105"
                @click="selectRune(rune)"
                @contextmenu.prevent="addRune(rune)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRunes } from '@src/stores/runesStore'
import { useVirtualScroll } from '@src/composables/virtualScroll'
import { useInfo } from '@src/stores/infoStore'
import RuneDisplayMedium from '@src/components/RuneDisplayMedium.vue'
import RuneSearchBar from '@src/components/RuneSearchBar.vue'
import { storeToRefs } from 'pinia'
import { useDeck } from '@src/stores/deckStore'

const { filteredList, allRunes } = storeToRefs(useRunes())
const { addRune } = useDeck()
const { selectRune } = useInfo()

const {
    scrollContainer,
    viewContainer,
    onScroll,
    containerStyle,
    visibleList,
} = useVirtualScroll(filteredList as any)
</script>

<style scoped>
.spinner {
    margin: 100px auto;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-top-color: #2452a1;
    animation: spin 0.8s ease-in-out infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
