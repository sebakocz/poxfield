<template>
    <transition name="fade">
        <div
            v-if="infoStore.selectedRune"
            class="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 p-8"
            @click="closeOnClickOutside($event)"
        >
            <div
                class="scrollbar-hide relative h-full overflow-auto rounded bg-white shadow-lg dark:bg-gray-800 sm:w-[70%]"
            >
                <div class="sticky top-0 z-20 bg-white p-2 dark:bg-gray-800">
                    <h2 class="text-xl font-bold">{{ selectedRune.name }}</h2>
                </div>
                <div class="flex-grow">
                    <div class="flex flex-wrap justify-center lg:flex-nowrap">
                        <div class="flex flex-col pl-2">
                            <RuneDisplayMedium
                                v-if="isMobile"
                                :rune="selectedRune"
                            />
                            <RuneDisplayLarge v-else :rune="selectedRune" />
                            <span class="text-xs italic">
                                Artist: {{ selectedRune.artist }}
                            </span>
                            <div class="my-2 flex flex-col">
                                <button
                                    class="my-1 rounded bg-blue-600 p-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-800"
                                    :disabled="
                                        deckStore.countRune(
                                            selectedRune.hash
                                        ) >= selectedRune.deckLimit ||
                                        deckStore.deckLength >= 30
                                    "
                                    @click="deckStore.addRune(selectedRune)"
                                >
                                    Add to deck!
                                    <span>
                                        ({{
                                            deckStore.countRune(
                                                selectedRune.hash
                                            )
                                        }}/{{ selectedRune.deckLimit }})
                                    </span>
                                </button>
                                <button
                                    v-if="infoStore.isDeck"
                                    class="my-1 rounded bg-red-600 p-2 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-800"
                                    :disabled="
                                        deckStore.countRune(
                                            selectedRune.hash
                                        ) <= 0
                                    "
                                    @click="handleRemove"
                                >
                                    Remove
                                </button>
                            </div>
                            <div class="my-2 flex flex-col rounded p-2">
                                <span v-if="selectedRune.size">
                                    Size: {{ selectedRune.size }}
                                </span>
                                <span v-if="selectedRune.races">
                                    Race{{
                                        selectedRune.races.length > 1
                                            ? 's'
                                            : ''
                                    }}: {{ selectedRune.races.join(', ') }}
                                </span>
                                <span v-if="selectedRune.classes">
                                    Class{{
                                        selectedRune.classes.length > 1
                                            ? 'es'
                                            : ''
                                    }}: {{ selectedRune.classes.join(', ') }}
                                </span>
                            </div>
                            <div class="my-2 flex flex-col rounded p-2">
                                <span>
                                    Allow Ranked:
                                    {{ selectedRune.allowRanked ? '✔' : '✖' }}
                                </span>
                                <span>
                                    Tradeable:
                                    {{ selectedRune.tradeable ? '✔' : '✖' }}
                                </span>
                                <span>
                                    For Sale:
                                    {{ selectedRune.forSale ? '✔' : '✖' }}
                                </span>
                            </div>
                        </div>

                        <div
                            v-if="!selectedRune.flavorText"
                            class="mx-2 flex flex-col gap-2 text-left"
                        >
                            <AbilityBlock
                                title="Level 2"
                                :abilities="
                                    selectedRune.abilitySets[0].abilities
                                "
                                @select-ability="
                                    setAbility(selectedRune, 0, $event)
                                "
                            />
                            <AbilityBlock
                                title="Level 3"
                                :abilities="
                                    selectedRune.abilitySets[1].abilities
                                "
                                @select-ability="
                                    setAbility(selectedRune, 1, $event)
                                "
                            />
                            <AbilityBlock
                                title="Basic Abilities"
                                :abilities="selectedRune.startingAbilities"
                            />
                        </div>
                        <div v-else class="p-5">
                            {{
                                selectedRune.description.replace(/<[^>]+>/g, '')
                            }}
                        </div>
                    </div>
                </div>
                <p class="m-5 p-2 italic text-gray-400">
                    {{
                        selectedRune.flavorText
                            ? selectedRune.flavorText
                            : selectedRune.description
                    }}
                </p>
                <div class="sticky bottom-0">
                    <button
                        class="w-full rounded-none bg-gray-300 p-2 font-bold hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-800"
                        @click="infoStore.clearSelectedRune()"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { useInfo } from '@src/stores/infoStore'
import { useDeck } from '@src/stores/deckStore'
import { computed, onMounted, onUnmounted } from 'vue'
import RuneDisplayLarge from '@src/components/RuneDisplayLarge.vue'
import RuneDisplayMedium from '@src/components/RuneDisplayMedium.vue'
import { useMobileCheck } from '@src/composables/mobileCheck'
import { Rune } from '@src/libs/api/poxDto'
import AbilityBlock from '@src/components/AbilityBlock.vue'
import { setAbility } from '@src/libs/rune'

const infoStore = useInfo()
const deckStore = useDeck()

const selectedRune = computed(() => infoStore.selectedRune as Rune)

const closeOnClickOutside = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
        infoStore.clearSelectedRune()
    }
}

const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        infoStore.clearSelectedRune()
    }
}

onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
})

const { isMobile } = useMobileCheck()

const handleRemove = () => {
    deckStore.removeRune({
        ...selectedRune,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        deckId: infoStore.deckId,
    })
    infoStore.clearSelectedRune()
}
</script>
