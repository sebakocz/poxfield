<template>
    <div class="flex h-16 w-full gap-2">
        <div
            v-for="route in navRoutes"
            :key="route.name"
            class="flex w-full items-center justify-center rounded-t bg-gray-200 p-3 text-xl sm:duration-200"
            :class="{
                'mt-auto h-14 cursor-pointer bg-gray-50 hover:h-16 hover:bg-gray-300':
                    currentRouteIndex !== navRoutes.indexOf(route),
                'h-16': currentRouteIndex === navRoutes.indexOf(route),
            }"
            @click="currentRouteIndex = navRoutes.indexOf(route)"
        >
            {{
                route.name === 'Runes' && !isMobile
                    ? `Runes (${runesStore.filteredList.length}/${runesStore.allRunes.length})`
                    : route.name
            }}
            <transition name="fade">
                <div
                    v-if="
                        route.name === 'Filter' &&
                        runesStore.activeFilterKeys.length
                    "
                    class="ml-1 rounded-full bg-blue-600 py-0.5 px-1.5 text-xs font-semibold text-white shadow duration-200"
                >
                    {{ runesStore.activeFilterKeys.length }}
                </div>
            </transition>
        </div>
    </div>
    <div class="flex-grow overflow-hidden bg-gray-200">
        <RunesView v-if="currentRouteIndex === 0" />
        <FilterView v-else-if="currentRouteIndex === 1" />
        <BattleGroupView v-else-if="currentRouteIndex === 2" />
    </div>
</template>

<script setup lang="ts">
import { usePoxApi } from '@src/api/poxApi'
import { onMounted, ref } from 'vue'
import { navRoutes } from '@src/constants/nav'
import RunesView from '@src/views/RunesView.vue'
import FilterView from '@src/views/FilterView.vue'
import BattleGroupView from '@src/views/BattleGroupView.vue'
import { useRunes } from '@src/stores/runesStore'
import { useMobileCheck } from '@src/composables/mobileCheck'

const poxApi = usePoxApi()
const runesStore = useRunes()

onMounted(async () => {
    await poxApi.initializeRunes()
    await runesStore.setupPossibleValues()
})

const currentRouteIndex = ref(0)

const { isMobile } = useMobileCheck()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
