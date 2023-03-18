<template>
    <div class="sticky top-0 z-10 w-full bg-gray-200 p-3">
        <input
            type="text"
            class="w-full rounded p-2 text-center shadow lg:w-10/12"
            placeholder="Search for names, classes, abilities and more..."
            :value="searchQuery"
            @input="debouncedSearch"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from 'lodash'
import { useFilter } from '@src/stores/filterStore'

const filterStore = useFilter()
const searchQuery = ref(filterStore.searchQuery)

// Update the filterStore.searchQuery with a debounced function
const debouncedSearch = debounce((e) => {
    filterStore.searchQuery = e.target.value
}, 300)

// Update the input field when the filterStore.searchQuery changes
watch(filterStore, () => {
    searchQuery.value = filterStore.searchQuery
})
</script>
