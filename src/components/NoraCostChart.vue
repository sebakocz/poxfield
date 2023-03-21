<template>
    <div id="nora-cost-chart" class="h-96 w-full p-4">
        <Bar :options="chartOptions" :data="chartData" />
    </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { onMounted, ref, watchEffect } from 'vue'
import { DeckRune, useDeck } from '@src/stores/deckStore'
import { Chart, BarElement, CategoryScale, LinearScale, Title } from 'chart.js'

const deckStore = useDeck()

Chart.register(Title, BarElement, CategoryScale, LinearScale)

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
    animation: {
        duration: 1000,
        x: {
            from: 400,
        },
        y: {
            from: 1000,
        },
    },
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
        const sortedRunes = JSON.parse(
            JSON.stringify(deckStore.deckRunes)
        ).sort((a: DeckRune, b: DeckRune) => a.noraCost - b.noraCost)

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
</script>
