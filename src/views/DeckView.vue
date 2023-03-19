<template>
    <div class="h-full overflow-y-auto">
        <div v-if="!deckStore.deckLength" class="mt-20 p-2 text-center text-xl">
            Add cards to your deck to see them here!
        </div>
        <div v-else class="flex flex-col items-center justify-center p-2">
            <div
                class="flex flex-wrap items-center justify-center gap-2 bg-gray-300 p-2 md:w-[70%]"
            >
                <RuneDisplaySmall
                    v-for="rune in deckStore.deckRunes"
                    :key="rune.deckId"
                    :rune="rune"
                    class="cursor-pointer duration-200 hover:scale-105"
                    @click="selectRune(rune, true, rune.deckId)"
                />
            </div>

            <div id="my-chart-id" class="h-96 w-full p-4">
                <Bar :options="chartOptions" :data="chartData" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import RuneDisplaySmall from '@src/components/RuneDisplaySmall.vue'
import { useDeck } from '@src/stores/deckStore'
import { useInfo } from '@src/stores/infoStore'
import { Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    BarElement,
    CategoryScale,
    LinearScale,
} from 'chart.js'
import { onMounted, ref, watchEffect } from 'vue'

ChartJS.register(Title, BarElement, CategoryScale, LinearScale)

const chartData = ref({
    labels: [],
    datasets: [
        {
            label: 'Nora Cost',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
    ],
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
        },
        title: {
            display: true,
            text: 'Nora Cost Distribution',
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1,
                precision: 0,
                callback: function (value) {
                    if (Number.isInteger(value)) {
                        return value
                    }
                },
            },
        },
    },
}

onMounted(() => {
    watchEffect(() => {
        const labels = Array.from({ length: 13 }, (_, i) => i * 10)
        const data = new Array(13).fill(0)
        const sortedRunes = deckStore.deckRunes.sort(
            (a, b) => a.noraCost - b.noraCost
        )

        for (const rune of sortedRunes) {
            const index = Math.floor(rune.noraCost / 10)
            data[index]++
        }

        chartData.value = {
            labels,
            datasets: [
                {
                    label: 'Nora Cost',
                    data,
                    backgroundColor: 'rgb(36,82,161)',
                    borderColor: 'rgb(232,236,255)',
                    borderWidth: 1,
                },
            ],
        }
    })
})

const deckStore = useDeck()
const { selectRune } = useInfo()
</script>
