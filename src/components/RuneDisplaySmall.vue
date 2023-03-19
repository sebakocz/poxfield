<template>
    <img :src="runeImg" :alt="props.rune.name" class="w-12" />
</template>

<script setup lang="ts">
import { Rune } from '@src/api/poxApiDto'
import { computed } from 'vue'
import { getRuneImgSmall } from '@src/api/poxApiLinks'

const props = defineProps<{
    rune: Rune
}>()

const runeImg = computed(() => getRuneImgSmall(props.rune.hash))
</script>
