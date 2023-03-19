<template>
    <div class="w-full bg-gray-200 p-3">
        <input
            v-model="runesStore.searchQuery"
            type="text"
            class="w-full rounded p-2 text-center shadow lg:w-10/12"
            placeholder="Search for names, classes, abilities and more..."
        />
    </div>
</template>

<script setup lang="ts">
import { useRunes } from '@src/stores/runesStore'

const runesStore = useRunes()
</script>
