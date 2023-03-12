import { ref } from 'vue'
import { useRunesStore } from '@src/stores/runesStore'
import { Champion, Equipment, Relic, Spell } from '@src/poxApiDto'

enum ApiEndpoints {
    GET_ALL_RUNES = '/api/feed.do?t=json',
}

export const usePoxApi = () => {
    const isFetching = ref(false)

    const { champions, equipment, relics, spells } = useRunesStore()
    const fetchAllRunes = async () => {
        isFetching.value = true
        const response = await fetch(ApiEndpoints.GET_ALL_RUNES)
        isFetching.value = false
        return await response.json()
    }

    if (!champions.length) {
        fetchAllRunes().then((data) => {
            // try to validate the data by casting it to the expected type
            const fetchConfig = [
                { key: 'champs', array: champions },
                { key: 'equips', array: equipment },
                { key: 'relics', array: relics },
                { key: 'spells', array: spells },
            ]
            fetchConfig.forEach((config) => {
                try {
                    const { key, array } = config
                    const runeType = data[key] as
                        | Champion[]
                        | Equipment[]
                        | Relic[]
                        | Spell[]
                    array.push(...runeType)
                } catch (error) {
                    console.error(error)
                }
                console.log(`Done fetching ${config.key}!`)
            })
        })
    }

    return {
        fetchAllRunes,
        isFetching,
    }
}
