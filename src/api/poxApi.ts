import { ref } from 'vue'
import { useRunes } from '@src/stores/runesStore'
import { Champion, Equipment, Relic, Spell } from './poxApiDto'
import localforage from 'localforage'
import { ApiEndpoints } from '@src/api/poxApiLinks'

const CURRENT_VERSION = 1
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

    const { allChampions, allEquipments, allRelics, allSpells, allRunes } =
        useRunes()

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
        const champsFromDB = (await db.getItem('champs')) as Champion[]
        const equipsFromDB = (await db.getItem('equips')) as Equipment[]
        const relicsFromDB = (await db.getItem('relics')) as Relic[]
        const spellsFromDB = (await db.getItem('spells')) as Spell[]

        allChampions.push(...champsFromDB)
        allEquipments.push(...equipsFromDB)
        allRelics.push(...relicsFromDB)
        allSpells.push(...spellsFromDB)
    }

    const saveRunesToDB = async (data: any) => {
        const fetchConfig = [
            { key: 'champs', array: allChampions },
            { key: 'equips', array: allEquipments },
            { key: 'relics', array: allRelics },
            { key: 'spells', array: allSpells },
        ]
        fetchConfig.forEach((config) => {
            try {
                const { key, array } = config
                const runes = data[key] as
                    | Champion[]
                    | Equipment[]
                    | Relic[]
                    | Spell[]
                const uniqueRunes = runes.filter(
                    (rune) => rune.rarity !== 'LIMITED'
                )
                array.push(...uniqueRunes)
                db.setItem(key, uniqueRunes)
            } catch (error) {
                console.error(`API: Error fetching ${config.key}!`, error)
                throw error
            } finally {
                console.log(`API: Done fetching ${config.key}!`)
            }
        })

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

    initializeRunes()

    return {
        fetchAllRunes,
        isFetching,
    }
}
