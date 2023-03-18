import { onMounted, onUnmounted, ref } from 'vue'

export const useMobileCheck = () => {
    const isMobile = ref(false)

    const calculateIsMobile = () => (isMobile.value = window.innerWidth < 768)

    onMounted(() => {
        calculateIsMobile()
        window.addEventListener('resize', calculateIsMobile)
    })
    onUnmounted(() => {
        window.removeEventListener('resize', calculateIsMobile)
    })

    return { isMobile }
}
