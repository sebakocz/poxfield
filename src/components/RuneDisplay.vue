<template>
    <div class="text-truncate w-full w-52 p-2">
        <div class="relative mx-auto h-[211px] w-[170px]">
            <img
                :src="runeImg"
                class="absolute top-4 left-2"
                alt="Rune Image"
            />
            <img
                :src="rarityFrameImg"
                class="absolute top-0 left-0"
                alt="Rarity Frame Image"
            />
            <img
                :src="backgroundFrameImg"
                class="absolute top-0 left-0"
                alt="Background Frame Image"
            />
            <img
                v-if="'hitPoints' in props.rune"
                :src="iconsFrameImg"
                class="absolute top-0 left-0"
                alt="Icons Frame Image"
            />
            <span class="highlight absolute top-1 left-0 right-0 text-sm">
                {{ props.rune.name }}
            </span>
            <span class="highlight absolute top-1 right-[4%]">
                {{ props.rune.noraCost }}
            </span>
            <span
                v-if="'damage' in props.rune"
                class="highlight absolute -bottom-0.5 left-[12%] w-4 text-xs"
            >
                {{ props.rune.damage }}
            </span>
            <span
                v-if="'speed' in props.rune"
                class="highlight absolute -bottom-0.5 left-[28.5%] w-4 text-xs"
            >
                {{ props.rune.speed }}
            </span>
            <span
                v-if="'minRng' in props.rune"
                class="highlight absolute -bottom-0.5 left-[44.5%] w-4 text-xs"
            >
                {{ props.rune.minRng }}-{{ props.rune.maxRng }}
            </span>
            <span
                v-if="'defense' in props.rune"
                class="highlight absolute -bottom-0.5 left-[61.5%] w-4 text-xs"
            >
                {{ props.rune.defense }}
            </span>
            <span
                v-if="'hitPoints' in props.rune"
                class="highlight absolute -bottom-0.5 left-[77.5%] w-4 text-xs"
            >
                {{ props.rune.hitPoints }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Champion, Equipment, Relic, Spell } from '../api/poxApiDto'
import {
    getBackgroundFrameImg,
    getIconsFrameImg,
    getRarityFrameImg,
    getRuneImgMedium,
} from '@src/api/poxApiLinks'
import { computed } from 'vue'

const props = defineProps<{
    rune: Champion | Equipment | Relic | Spell
}>()

const runeImg = computed(() => getRuneImgMedium(props.rune.hash))
const rarityFrameImg = computed(() => getRarityFrameImg(props.rune.rarity))
const backgroundFrameImg = computed(() => getBackgroundFrameImg())
const iconsFrameImg = computed(() => getIconsFrameImg())
</script>

<style scoped>
.text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.highlight {
    color: #fff;
    text-shadow: 1px 2px 1px #000000;
}
</style>
