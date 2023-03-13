import { ref } from 'vue'
import { useRunes } from '@src/stores/runesStore'
import { Champion, Equipment, Relic, Spell } from '@src/poxApiDto'
import localforage from 'localforage'

enum ApiEndpoints {
    GET_ALL_RUNES = 'https://raw.githubusercontent.com/sebakocz/poxfield/json-data/runes.json',
}

const CARD_GAME_DATA_EXPIRATION_TIME = 24 * 60 * 60 * 1000 * 7 // 7 days

export const usePoxApi = () => {
    const isFetching = ref(false)

    const { allChampions, allEquipments, allRelics, allSpells, allRunes } =
        useRunes()

    const db = localforage.createInstance({
        name: 'poxfield',
        storeName: 'runesList',
    })

    const fetchAllRunes = async () => {
        isFetching.value = true
        const response = await fetch(ApiEndpoints.GET_ALL_RUNES)
        isFetching.value = false
        return await response.json()
    }

    const initializeRunes = async () => {
        if (allRunes.length || isFetching.value) return

        try {
            const dataFromDB = (await db.getItem('runes')) as {
                champs: Champion[]
                equips: Equipment[]
                relics: Relic[]
                spells: Spell[]
                timestamp: number
            }
            if (dataFromDB) {
                const dataTimestamp = dataFromDB.timestamp
                const now = new Date().getTime()
                if (now - dataTimestamp < CARD_GAME_DATA_EXPIRATION_TIME) {
                    // data is not expired, use it
                    allChampions.push(...dataFromDB.champs)
                    allEquipments.push(...dataFromDB.equips)
                    allRelics.push(...dataFromDB.relics)
                    allSpells.push(...dataFromDB.spells)
                    console.log('IndexedDB: Runes loaded from cache!')
                    return
                }
            }

            console.log('API: Fetching runes...')
            const data = await fetchAllRunes()

            const fetchConfig = [
                { key: 'champs', array: allChampions },
                { key: 'equips', array: allEquipments },
                { key: 'relics', array: allRelics },
                { key: 'spells', array: allSpells },
            ]
            fetchConfig.forEach((config) => {
                try {
                    const { key, array } = config
                    const rune = data[key] as
                        | Champion[]
                        | Equipment[]
                        | Relic[]
                        | Spell[]
                    array.push(...rune)
                } catch (error) {
                    console.error(`API: Error fetching ${config.key}!`, error)
                } finally {
                    console.log(`API: Done fetching ${config.key}!`)
                }
            })

            // store data with timestamp
            const dataWithTimestamp = {
                ...data,
                timestamp: new Date().getTime(),
            }
            await db.setItem('runes', dataWithTimestamp)
        } catch (error) {
            console.error('Error initializing runes!', error)
        }
    }

    initializeRunes()

    return {
        fetchAllRunes,
        isFetching,
    }
}
