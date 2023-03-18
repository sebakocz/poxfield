import { defineStore } from 'pinia'

export const useFilter = defineStore({
    id: 'filterStore',
    state: () => ({
        searchQuery: '',
    }),
})
