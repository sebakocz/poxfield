<template>
    <RuneSearchBar />
    <div class="h-[90%] overflow-y-auto">
        <div class="m-2 rounded border border-gray-500 p-2">
            <h3 class="mb-3 text-lg font-semibold">Categories</h3>
            <div
                class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
                <div
                    v-for="filter in categories"
                    :key="filter.key"
                    class="flex items-center"
                >
                    <label :for="filter.key" class="mr-2 font-semibold">
                        {{ filter.label }}
                    </label>
                    <select
                        :id="filter.key"
                        v-model="filter.query"
                        class="w-full rounded border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                        <option value="">Any</option>
                        <option
                            v-for="value in filter.possibleValues"
                            :key="value"
                            :value="value"
                        >
                            {{ value }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <div class="m-2 rounded border border-gray-500 p-2">
            <h3 class="mb-3 text-lg font-semibold">Stats</h3>
            <div
                class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
                <div
                    v-for="filter in numbers"
                    :key="filter.key"
                    class="flex items-center"
                >
                    <label
                        :for="filter.key"
                        class="whitespace-nowrap font-semibold"
                    >
                        {{ filter.label }}
                    </label>
                    <select
                        v-model="filter.condition"
                        class="mx-2 rounded border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                        <option value="moreThan">{{ '>' }}</option>
                        <option value="lessThan">{{ '<' }}</option>
                        <option value="moreOrEqual">{{ '>=' }}</option>
                        <option value="lessOrEqual">{{ '<=' }}</option>
                        <option value="equal">{{ '=' }}</option>
                    </select>
                    <input
                        :id="filter.key"
                        v-model="filter.query"
                        type="number"
                        min="0"
                        step="1"
                        class="w-full rounded border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>
            </div>
        </div>

        <div class="m-2 rounded border border-gray-500 p-2">
            <h3 class="mb-3 text-lg font-semibold">Effects</h3>
            <div
                class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
                <div
                    v-for="filter in effects"
                    :key="filter.key"
                    class="flex items-center"
                >
                    <label :for="filter.key" class="mr-2 font-semibold">
                        {{ filter.label }}
                    </label>
                    <select
                        :id="filter.key"
                        v-model="filter.query"
                        class="w-full rounded border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                        <option value="">Any</option>
                        <option
                            v-for="value in filter.possibleValues"
                            :key="value"
                            :value="value"
                        >
                            {{ value }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRunes } from '@src/stores/runesStore'
import RuneSearchBar from '@src/components/RuneSearchBar.vue'

const { categories, numbers, effects } = useRunes()
</script>
