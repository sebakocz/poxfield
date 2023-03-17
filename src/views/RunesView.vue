<template>
    <div
        ref="viewContainer"
        class="h-full overflow-y-scroll p-2 will-change-transform"
        @scroll="onScroll"
    >
        <div
            ref="scrollContainer"
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import RuneDisplay from '@src/components/RuneDisplay.vue'
import debounce from 'lodash/debounce'

const runesStore = useRunes()

// 10 of each rune type
// const testList = computed(() => [
//     ...runesStore.allChampions.slice(0, 10),
//     ...runesStore.allEquipments.slice(0, 10),
//     ...runesStore.allRelics.slice(0, 10),
//     ...runesStore.allSpells.slice(0, 10),
// ])

const testList = computed(() => runesStore.allChampions.slice(0, 51))

const runeDisplayHeight = 228.6
const runeDisplayWidth = 208
// higher number = more items in buffer, smoother scrolling
const bufferSize = 2

const scrollContainer = ref<HTMLElement>()
const viewContainer = ref<HTMLElement>()

const scrollTop = ref(0)
const onScroll = debounce(
    (event: Event) => {
        scrollTop.value = (event.target as HTMLElement).scrollTop
        console.log(scrollTop.value)
    },
    100,
    { maxWait: 100 }
)

const runesPerRow = ref(0)
const setRunesPerRow = () => {
    if (!scrollContainer.value?.clientWidth)
        throw new Error('No scroll container')
    runesPerRow.value = Math.floor(
        scrollContainer.value?.clientWidth / runeDisplayWidth
    )
}

const batchSize = ref(0)
const setBatchSize = () => {
    if (!viewContainer.value?.clientHeight) throw new Error('No view container')
    batchSize.value =
        runesPerRow.value *
        (Math.ceil(viewContainer.value?.clientHeight / runeDisplayHeight) +
            bufferSize)
}

const onResize = () => {
    if (scrollContainer.value) {
        setRunesPerRow()
        setBatchSize()
    }
}

let resizeObserver: ResizeObserver

onMounted(() => {
    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(scrollContainer.value as HTMLElement)
})

onUnmounted(() => {
    resizeObserver.disconnect()
})

const totalHeight = computed(
    () =>
        Math.ceil(testList.value.length / runesPerRow.value) * runeDisplayHeight
)

const startIndex = computed(() =>
    Math.max(
        0,
        Math.floor(scrollTop.value / runeDisplayHeight) * runesPerRow.value -
            runesPerRow.value * bufferSize
    )
)

const endIndex = computed(() =>
    Math.min(
        testList.value.length,
        Math.floor(scrollTop.value / runeDisplayHeight) * runesPerRow.value +
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
