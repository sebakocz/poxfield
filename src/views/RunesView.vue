<template>
    <RuneSearchBar />
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
import { useVirtualScroll } from '@src/composables/virtualScroll'
import { useInfo } from '@src/stores/infoStore'
import RuneDisplayMedium from '@src/components/RuneDisplayMedium.vue'
import RuneSearchBar from '@src/components/RuneSearchBar.vue'
import { storeToRefs } from 'pinia'

const { filteredList } = storeToRefs(useRunes())

const {
    scrollContainer,
    viewContainer,
    onScroll,
    containerStyle,
    visibleList,
} = useVirtualScroll(filteredList as any)

const { selectRune } = useInfo()
</script>
