import { computed, ComputedRef, onMounted, onUnmounted, ref } from 'vue'
import debounce from 'lodash/debounce'

const runeDisplayHeight = 228.6
const runeDisplayWidth = 208
// higher number = more items in buffer, smoother scrolling
const bufferSize = 2

/**
 * A Vue composable function for adding virtual scrolling functionality to a list of items.
 *
 * @param {ComputedRef<any[]>} inputList - A computed reference to the list of items to be displayed.
 * @returns {Object} An object containing necessary properties and methods for implementing virtual scrolling.
 */
export const useVirtualScroll = (inputList: ComputedRef<any[]>) => {
    // Scroll(inner) and view(outer) containers references
    const scrollContainer = ref<HTMLElement>()
    const viewContainer = ref<HTMLElement>()

    // Current scroll position, debounce to prevent excessive calls
    const scrollTop = ref(0)
    const onScroll = debounce(
        (event: Event) => {
            scrollTop.value = (event.target as HTMLElement).scrollTop
        },
        100,
        { maxWait: 100 }
    )

    // Calculate the number of runes per row based on the scroll container's width
    const runesPerRow = ref(0)
    const setRunesPerRow = () => {
        if (!scrollContainer.value?.clientWidth)
            throw new Error('No scroll container')
        runesPerRow.value = Math.floor(
            scrollContainer.value?.clientWidth / runeDisplayWidth
        )
    }

    // Calculate the batch size based on the view container's height and runes per row
    const batchSize = ref(0)
    const setBatchSize = () => {
        if (!viewContainer.value?.clientHeight)
            throw new Error('No view container')
        batchSize.value =
            runesPerRow.value *
            (Math.ceil(viewContainer.value?.clientHeight / runeDisplayHeight) +
                bufferSize)
    }

    // Calculate the total height of the scroll container based on the input list length
    const totalHeight = computed(
        () =>
            Math.ceil(inputList.value.length / runesPerRow.value) *
            runeDisplayHeight
    )

    // Calculate the starting index of the visible items in the input list
    const startIndex = computed(() =>
        Math.max(
            0,
            Math.floor(scrollTop.value / runeDisplayHeight) *
                runesPerRow.value -
                runesPerRow.value * bufferSize
        )
    )

    // Calculate the ending index of the visible items in the input list
    const endIndex = computed(() =>
        Math.min(
            inputList.value.length,
            Math.floor(scrollTop.value / runeDisplayHeight) *
                runesPerRow.value +
                batchSize.value
        )
    )

    // Update runesPerRow and batchSize when the containers are resized
    const onResize = () => {
        if (scrollContainer.value) {
            setRunesPerRow()
            setBatchSize()
        }
    }

    // Observe size changes in the scroll container using ResizeObserver
    let resizeObserver: ResizeObserver
    onMounted(() => {
        resizeObserver = new ResizeObserver(onResize)
        resizeObserver.observe(scrollContainer.value as HTMLElement)
    })
    onUnmounted(() => {
        resizeObserver.disconnect()
    })

    // Set the container style, including height and paddingTop for proper scrolling behavior
    const containerStyle = computed(() => ({
        height: `${totalHeight.value}px`,
        paddingTop: `${
            (startIndex.value / runesPerRow.value) * runeDisplayHeight
        }px`,
    }))

    const visibleList = computed(() =>
        inputList.value.slice(startIndex.value, endIndex.value)
    )

    return {
        scrollContainer,
        viewContainer,
        onScroll,
        containerStyle,
        visibleList,
    }
}
