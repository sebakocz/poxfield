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
            <RuneDisplayMedium
                v-for="rune in visibleList"
                :key="rune.id"
                :rune="rune"
                class="cursor-pointer duration-200 hover:scale-105"
                @click="selectRune(rune)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRunes } from '@src/stores/runesStore'
import { computed } from 'vue'
import { useVirtualScroll } from '@src/composables/virtualScroll'
import { useInfo } from '@src/stores/infoStore'
import RuneDisplayMedium from '@src/components/RuneDisplayMedium.vue'

const runesStore = useRunes()

// 10 of each rune type
// const testList = computed(() => [
//     ...runesStore.allChampions.slice(0, 10),
//     ...runesStore.allEquipments.slice(0, 10),
//     ...runesStore.allRelics.slice(0, 10),
//     ...runesStore.allSpells.slice(0, 10),
// ])

const testList = computed(() => runesStore.allRunes)

const {
    scrollContainer,
    viewContainer,
    onScroll,
    containerStyle,
    visibleList,
} = useVirtualScroll(testList)

const { selectRune } = useInfo()
</script>
