<template>
    <div
        ref="scrollable"
        class="h-full overflow-y-scroll p-2 will-change-transform"
        @scroll="onScroll"
    >
        <div
            class="flex flex-wrap content-start justify-center"
            :style="containerStyle"
        >
            <RuneDisplay
                v-for="rune in visibleList"
                :key="rune.id"
                :rune="rune"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRunes } from '@src/stores/runesStore'
import { computed, ref } from 'vue'
import RuneDisplay from '@src/components/RuneDisplay.vue'

const runesStore = useRunes()

// 10 of each rune type
// const testList = computed(() => [
//     ...runesStore.allChampions.slice(0, 10),
//     ...runesStore.allEquipments.slice(0, 10),
//     ...runesStore.allRelics.slice(0, 10),
//     ...runesStore.allSpells.slice(0, 10),
// ])

const testList = computed(() => runesStore.allChampions.slice(0, 51))

const scrollable = ref<HTMLElement>()
const scrollTop = ref(0)
const onScroll = (enent: Event) => {
    scrollTop.value = (enent.target as HTMLElement).scrollTop
}

const runeDisplayHeight = 228.6
const runeDisplayWidth = 208

const runesPerRow = computed(() =>
    // mention 1920 is a fallback
    Math.floor((scrollable.value?.clientWidth || 1920) / runeDisplayWidth)
)
const totalHeight = computed(
    () =>
        Math.ceil(testList.value.length / runesPerRow.value) * runeDisplayHeight
)

// mention X is a buffer for when the user scrolls fast
const batchSize = computed(() => runesPerRow.value * 2)

const startIndex = computed(() =>
    Math.max(
        0,
        Math.floor(scrollTop.value / runeDisplayHeight) * runesPerRow.value -
            batchSize.value
    )
)

const endIndex = computed(() =>
    Math.min(
        testList.value.length,
        Math.ceil(
            (scrollTop.value + (scrollable.value?.clientHeight || 1920)) /
                runeDisplayHeight
        ) *
            runesPerRow.value +
            batchSize.value
    )
)
const containerStyle = computed(() => ({
    height: `${totalHeight.value}px`,
    paddingTop: `${
        (startIndex.value / runesPerRow.value) * runeDisplayHeight
    }px`,
}))
const visibleList = computed(() =>
    testList.value.slice(startIndex.value, endIndex.value)
)
</script>
