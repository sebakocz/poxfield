<template>
    <div class="flex h-14 w-full gap-2">
        <div
            v-for="route in navRoutes"
            :key="route.name"
            class="h-14 w-full rounded-t bg-amber-200 p-3 sm:duration-200"
            :class="{
                'mt-auto h-12 cursor-pointer bg-amber-50 hover:h-16 hover:bg-amber-300':
                    currentRouteIndex !== navRoutes.indexOf(route),
            }"
            @click="currentRouteIndex = navRoutes.indexOf(route)"
        >
            {{ route.name }}
        </div>
    </div>
    <div class="h-full flex-grow bg-amber-200">
        <RunesView v-if="currentRouteIndex === 0" />
        <FilterView v-else-if="currentRouteIndex === 1" />
        <BattleGroupView v-else-if="currentRouteIndex === 2" />
    </div>
</template>

<script setup lang="ts">
import { usePoxApi } from '@src/api/poxApi'
import { ref } from 'vue'
import { navRoutes } from '@src/constants/nav'
import RunesView from '@src/views/RunesView.vue'
import FilterView from '@src/views/FilterView.vue'
import BattleGroupView from '@src/views/BattleGroupView.vue'

usePoxApi()

const currentRouteIndex = ref(0)
</script>
