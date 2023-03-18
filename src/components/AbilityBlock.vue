<template>
    <div class="flex flex-col gap-1 p-1">
        <span class="text-gray-400">{{ title }}:</span>
        <div v-for="ability in abilities" :key="ability.id">
            <div class="flex">
                <div class="p-1">
                    <img
                        :src="getIconImgSmall(ability.iconName)"
                        :alt="ability.name + ' Icon'"
                        class="w-9 rounded"
                    />
                </div>
                <div class="w-full rounded bg-gray-50 p-2">
                    <div class="mb-1 flex gap-1">
                        <span
                            class="flex-grow text-sm font-semibold text-gray-600"
                            >{{ ability.name }}:
                        </span>
                        <span
                            v-if="ability.cooldown"
                            class="rounded bg-gray-400 p-0.5 px-1 text-center text-xs font-semibold text-white"
                        >
                            CD: {{ ability.cooldown }}
                        </span>
                        <span
                            v-if="
                                ability.activationType === 1 ||
                                ability.activationType === 3
                            "
                            class="rounded bg-gray-400 p-0.5 px-1 text-center text-xs font-semibold text-white"
                        >
                            AP: {{ ability.apCost }}
                        </span>
                        <span
                            class="rounded bg-blue-600 p-0.5 px-1 text-center text-xs font-semibold text-white"
                        >
                            Nora: {{ ability.noraCost }}
                        </span>
                    </div>
                    <p>
                        {{ ability.shortDescription.replace(/<[^>]+>/g, '') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ability } from '@src/api/poxApiDto'
import { getIconImgSmall } from '@src/api/poxApiLinks'

defineProps<{
    title: string
    abilities: Ability[]
}>()
</script>
