import { ref } from 'vue'
import { useRunes } from '@src/stores/runesStore'
import { Champion, Equipment, Relic, Spell } from './poxApiDto'
import localforage from 'localforage'
import { ApiEndpoints } from '@src/api/poxApiLinks'

const DATA_EXPIRATION_TIME = 24 * 60 * 60 * 1000 * 7 // 7 days

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
            const champsFromDB = (await db.getItem('champs')) as Champion[]
            const equipsFromDB = (await db.getItem('equips')) as Equipment[]
            const relicsFromDB = (await db.getItem('relics')) as Relic[]
            const spellsFromDB = (await db.getItem('spells')) as Spell[]
            const timestampFromDB = (await db.getItem('timestamp')) as number
            if (
                champsFromDB &&
                equipsFromDB &&
                relicsFromDB &&
                spellsFromDB &&
                timestampFromDB
            ) {
                const now = new Date().getTime()
                if (now - timestampFromDB < DATA_EXPIRATION_TIME) {
                    // data is not expired, use it
                    allChampions.push(...champsFromDB)
                    allEquipments.push(...equipsFromDB)
                    allRelics.push(...relicsFromDB)
                    allSpells.push(...spellsFromDB)
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

            await db.setItem('timestamp', new Date().getTime())
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
