<template>
    <div class="text-truncate p-2">
        <div class="relative mx-auto h-[418px] w-[332px]">
            <div class="absolute h-full w-full rounded-2xl bg-black" />
            <img
                :src="runeImg"
                class="absolute left-0 right-0 top-0 bottom-2 mx-auto my-auto"
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
                class="absolute bottom-1 w-full"
                alt="Icons Frame Image"
            />
            <div class="relative top-8 left-10">
                <img
                    :src="leftFactionImg"
                    alt="Left Faction Image"
                    class="absolute"
                />
                <img
                    :src="rightFactionImg"
                    alt="Right Faction Image"
                    class="absolute"
                />
            </div>
            <span class="highlight absolute top-7 left-0 right-0 text-xl">
                {{ props.rune.name }}
            </span>
            <transition name="fade" mode="out-in">
                <span
                    :key="props.rune.noraCost"
                    class="highlight absolute top-6 right-6 text-2xl"
                >
                    {{ props.rune.noraCost }}
                </span>
            </transition>
            <span
                v-if="'damage' in props.rune"
                class="highlight absolute bottom-2.5 left-[13.5%] w-4 text-xl"
            >
                {{ props.rune.damage }}
            </span>
            <span
                v-if="'speed' in props.rune"
                class="highlight absolute bottom-2.5 left-[31%] w-4 text-xl"
            >
                {{ props.rune.speed }}
            </span>
            <span
                v-if="'minRng' in props.rune"
                class="highlight absolute bottom-2.5 left-[46%] w-4 text-xl"
            >
                {{ props.rune.minRng }}-{{ props.rune.maxRng }}
            </span>
            <span
                v-if="'defense' in props.rune"
                class="highlight absolute bottom-2.5 left-[64%] w-4 text-xl"
            >
                {{ props.rune.defense }}
            </span>
            <span
                v-if="'hitPoints' in props.rune"
                class="highlight absolute bottom-2.5 left-[79.5%] w-4 text-xl"
            >
                {{ props.rune.hitPoints }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Rune } from '@src/libs/api/poxDto'
import {
    getBackgroundFrameImgLarge,
    getStatsFrameImg,
    getRarityFrameImgLarge,
    getRuneImgLarge,
    getFactionImgs,
} from '@src/libs/api/poxLinks'
import { computed } from 'vue'

const props = defineProps<{
    rune: Rune
}>()

const runeImg = computed(() => getRuneImgLarge(props.rune.hash))
const rarityFrameImg = computed(() => getRarityFrameImgLarge(props.rune.rarity))
const backgroundFrameImg = computed(() => getBackgroundFrameImgLarge())
const iconsFrameImg = computed(() => getStatsFrameImg())
const { rightFactionImg, leftFactionImg } = getFactionImgs(props.rune.factions)
</script>
