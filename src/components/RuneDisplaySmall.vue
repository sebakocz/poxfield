<template>
    <img :src="runeImg" :alt="props.rune.name" class="w-12" />
</template>

<script setup lang="ts">
import { Rune } from '@src/libs/api/poxDto'
import { computed } from 'vue'
import { getRuneImgSmall } from '@src/libs/api/poxLinks'

const props = defineProps<{
    rune: Rune
}>()

const runeImg = computed(() => getRuneImgSmall(props.rune.hash))
</script>
