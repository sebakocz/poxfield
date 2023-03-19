import { ref } from 'vue'
import { useRunes } from '@src/stores/runesStore'
import { Rune } from './poxApiDto'
import localforage from 'localforage'
import { ApiEndpoints } from '@src/api/poxApiLinks'

const CURRENT_VERSION = 3
const DATA_EXPIRATION_TIME = 24 * 60 * 60 * 1000 * 7 // 7 days

const DB_OPTIONS: LocalForageOptions = {
    name: 'poxfield',
    storeName: 'runesList',
}

type DbTimestamp = {
    version: number
    date: number
}

export const usePoxApi = () => {
    const isFetching = ref(false)

    const { allRunes } = useRunes()

    const db = localforage.createInstance(DB_OPTIONS)

    const isDataExpired = async () => {
        // check version & expiration time
        const timestampFromDB = (await db.getItem('timestamp')) as DbTimestamp
        if (!timestampFromDB) return true
        if (timestampFromDB.version !== CURRENT_VERSION) return true
        if (Date.now() - timestampFromDB.date > DATA_EXPIRATION_TIME)
            return true
    }

    const fetchAllRunes = async () => {
        isFetching.value = true
        const response = await fetch(ApiEndpoints.GET_ALL_RUNES)
        isFetching.value = false
        return await response.json()
    }

    const loadRunesFromDB = async () => {
        const runesFromDB = (await db.getItem('runes')) as Rune[]
        allRunes.push(...runesFromDB)
    }

    const saveRunesToDB = async (data: any) => {
        try {
            const keys = ['champs', 'equips', 'relics', 'spells']
            const types = ['Champion', 'Equipment', 'Relic', 'Spell']
            const newRunes: Rune[] = []
            for (const key of keys) {
                const runes = data[key].map((rune: any) => ({
                    ...rune,
                    type: types[keys.indexOf(key)],
                })) as Rune[]
                const uniqueRunes = runes.filter(
                    (rune) => rune.rarity !== 'LIMITED'
                )
                newRunes.push(...uniqueRunes)
            }
            const sortedRunes = newRunes.sort((a, b) =>
                a.name.localeCompare(b.name)
            )

            allRunes.push(...sortedRunes)
            await db.setItem('runes', sortedRunes)
        } catch (error) {
            console.error(`API: Error fetching runes!`, error)
            throw error
        } finally {
            console.log(`API: Done fetching runes!`)
        }

        await db.setItem('timestamp', {
            version: CURRENT_VERSION,
            date: new Date().getTime(),
        } as DbTimestamp)
    }

    const initializeRunes = async () => {
        // if runes are already loaded, don't fetch them again
        if (allRunes.length || isFetching.value) return

        // if runes are not loaded, try to load them from cache
        if (!(await isDataExpired())) {
            try {
                await loadRunesFromDB()
                console.log('IndexedDB: Runes loaded from cache!')
                return
            } catch (error) {
                console.error('Error loading runes from cache!', error)
            }
        }

        // if runes are not loaded and cache is expired, fetch them from API
        try {
            console.log('API: Fetching runes...')
            const data = await fetchAllRunes()
            await saveRunesToDB(data)
        } catch (error) {
            console.error('Error fetching runes!', error)
        }
    }

    return {
        fetchAllRunes,
        isFetching,
        initializeRunes,
    }
}
