<template>
    <transition name="fade">
        <div
            v-if="infoStore.selectedRune"
            class="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 p-8"
            @click="closeOnClickOutside($event)"
        >
            <div
                class="relative h-full overflow-auto rounded bg-white p-12 shadow-lg sm:w-[70%]"
            >
                <h2 class="mt-5 mb-2 text-xl font-bold">
                    {{ infoStore.selectedRune.name }}
                </h2>
                <p>{{ infoStore.selectedRune.description }}</p>
                <button
                    class="absolute top-0 right-0 m-1 text-2xl font-bold text-red-700"
                    @click="infoStore.clearSelectedRune()"
                >
                    &times;
                </button>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { useInfo } from '@src/stores/infoStore'
import { onMounted, onUnmounted } from 'vue'

const infoStore = useInfo()

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
