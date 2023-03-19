<template>
    <div class="h-full overflow-y-auto">
        <div class="m-2 rounded border border-amber-600 p-2">
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
        <div class="m-2 rounded border border-amber-600 p-2">
            <h3 class="mb-3 text-lg font-semibold">Number Filters</h3>
            <div
                class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
                <div
                    v-for="filter in numbers"
                    :key="filter.key"
                    class="flex items-center"
                >
                    <label :for="filter.key" class="mr-2 font-semibold">
                        {{ filter.key }}
                    </label>
                    <select
                        v-model="filter.condition"
                        class="rounded border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                        <option value="moreThan">More than</option>
                        <option value="lessThan">Less Than</option>
                        <option value="moreOrEqual">More or Equal</option>
                        <option value="lessOrEqual">Less or Equal</option>
                        <option value="equal">Equal</option>
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
    </div>
</template>

<script setup lang="ts">
import { useRunes } from '@src/stores/runesStore'

const { categories, numbers } = useRunes()
</script>
