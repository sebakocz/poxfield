<template>
    <div class="flex w-full gap-1">
        <div v-for="index in 3" :key="index" class="w-full bg-amber-200 p-2">
            Hey!
        </div>
    </div>
    <div class="h-32 bg-amber-200">Main</div>
</template>

<script setup lang="ts">
import { usePoxApi } from '@src/composables/poxApi'

usePoxApi()
</script>
