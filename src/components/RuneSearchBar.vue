<template>
    <div class="w-full bg-gray-200 p-3">
        <input
            type="text"
            class="w-full rounded p-2 text-center shadow lg:w-10/12"
            :placeholder="
                isMobile
                    ? 'Search...'
                    : 'Search for names, classes, abilities and more...'
            "
            :value="runesStore.searchQuery"
            @input="onInput"
        />
    </div>
</template>

<script setup lang="ts">
import { useRunes } from '@src/stores/runesStore'
import debounce from 'lodash/debounce'
import { useMobileCheck } from '@src/composables/mobileCheck'

const runesStore = useRunes()
const { isMobile } = useMobileCheck()

const onInput = debounce((event) => {
    runesStore.searchQuery = event.target.value
}, 300)
</script>
