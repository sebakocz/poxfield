<template>
    <div class="w-full bg-gray-200 p-3">
        <input
            type="text"
            class="w-full rounded p-2 text-center shadow lg:w-10/12"
            placeholder="Search for names, classes, abilities and more..."
            :value="searchQuery"
            @input="onInput"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRunes } from '@src/stores/runesStore'
import debounce from 'lodash/debounce'

const runesStore = useRunes()
const searchQuery = ref('')

const onInput = debounce((event) => {
    runesStore.searchQuery = event.target.value
}, 300)

watchEffect(() => {
    if (searchQuery.value !== runesStore.searchQuery) {
        searchQuery.value = runesStore.searchQuery
    }
})
</script>
