<template>
    <transition name="fade">
        <div
            v-if="infoStore.selectedRune"
            class="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 p-8"
            @click="closeOnClickOutside($event)"
        >
            <div
                class="scrollbar-hide relative h-full overflow-auto rounded bg-white shadow-lg sm:w-[70%]"
            >
                <div class="sticky top-0 z-20 bg-white p-2">
                    <h2 class="text-xl font-bold">{{ selectedRune.name }}</h2>
                </div>
                <div class="flex-grow">
                    <!-- content start -->
                    <div class="flex">
                        <div class="flex flex-col pl-2">
                            <RuneDisplayMedium
                                v-if="isMobile"
                                :rune="selectedRune"
                            />
                            <RuneDisplayLarge v-else :rune="selectedRune" />
                            <span class="text-xs italic">
                                Artist: {{ selectedRune.artist }}
                            </span>
                            <div class="my-2">
                                <div class="mt-2 rounded bg-blue-200 p-2">
                                    Add to deck!
                                </div>
                                <span class="text-xs italic">
                                    Max: {{ selectedRune.deckLimit }}
                                </span>
                            </div>
                            <div
                                class="flex flex-col rounded bg-gray-100 p-2 text-left"
                            >
                                <span> Size: {{ selectedRune.size }} </span>
                                <span>
                                    Race{{
                                        selectedRune.races.length > 1
                                            ? 's'
                                            : ''
                                    }}: {{ selectedRune.races.join(', ') }}
                                </span>
                                <span>
                                    Class{{
                                        selectedRune.classes.length > 1
                                            ? 'es'
                                            : ''
                                    }}: {{ selectedRune.classes.join(', ') }}
                                </span>
                            </div>
                        </div>

                        <div class="mx-2 flex w-full flex-col gap-2 text-left">
                            <AbilityBlock
                                title="Basic Abilities"
                                :abilities="selectedRune.startingAbilities"
                            />
                            <AbilityBlock
                                title="Level 2"
                                :abilities="
                                    selectedRune.abilitySets[0].abilities
                                "
                            />
                            <AbilityBlock
                                title="Level 3"
                                :abilities="
                                    selectedRune.abilitySets[1].abilities
                                "
                            />
                        </div>
                    </div>
                    <!-- content end -->
                </div>
                <div class="sticky bottom-0">
                    <button
                        class="w-full rounded-none bg-gray-300 font-bold"
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
import { computed, onMounted, onUnmounted } from 'vue'
import RuneDisplayLarge from '@src/components/RuneDisplayLarge.vue'
import RuneDisplayMedium from '@src/components/RuneDisplayMedium.vue'
import { useMobileCheck } from '@src/composables/mobileCheck'
import { Champion, Relic, Spell, Equipment } from '@src/api/poxApiDto'
import AbilityBlock from '@src/components/AbilityBlock.vue'

const infoStore = useInfo()

const selectedRune = computed(
    () => infoStore.selectedRune as Champion | Relic | Equipment | Spell
)

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
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
