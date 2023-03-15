<template>
    <p>Runes!</p>
    <div class="flex flex-wrap justify-center gap-2 p-2">
        <RuneDisplay v-for="rune in testList" :key="rune.id" :rune="rune" />
    </div>
</template>

<script setup lang="ts">
import { useRunes } from '@src/stores/runesStore'
import { computed } from 'vue'
import RuneDisplay from '@src/components/RuneDisplay.vue'

const runesStore = useRunes()

// 10 of each rune type
const testList = computed(() => [
    ...runesStore.allChampions.slice(0, 10),
    ...runesStore.allEquipments.slice(0, 10),
    ...runesStore.allRelics.slice(0, 10),
    ...runesStore.allSpells.slice(0, 10),
])
</script>
