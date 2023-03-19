import { defineStore } from 'pinia'
import { Rune } from '@src/api/poxApiDto'

export const useInfo = defineStore({
    id: 'infoStore',
    state: () => ({
        selectedRune: null as Rune | null,
        isDeck: false,
        deckId: undefined as string | undefined,
    }),
    actions: {
        selectRune(rune: Rune, isDeck = false, deckId?: string) {
            this.deckId = deckId
            this.isDeck = isDeck
            if (isDeck) {
                this.selectedRune = rune
                return
            }

            if (rune.type === 'Champion') {
                const champ = JSON.parse(JSON.stringify(rune)) as Rune
                champ.abilitySets?.forEach((abilitySet) => {
                    abilitySet.abilities.forEach((ability) => {
                        ability.selected = ability.default
                    })
                })

                this.selectedRune = champ
                return
            }

            this.selectedRune = JSON.parse(JSON.stringify(rune)) as Rune
        },
        clearSelectedRune() {
            this.selectedRune = null
        },
        setSelectedAbility(indexAbility: number, indexAbilitySet: number) {
            if (this.selectedRune && this.selectedRune.type === 'Champion') {
                if (!this.selectedRune.abilitySets)
                    throw new Error('abilitySets is null')
                const abilities =
                    this.selectedRune.abilitySets[indexAbilitySet]?.abilities
                abilities.forEach((ability, i) => {
                    if (!this.selectedRune)
                        throw new Error('selectedRune is null')

                    // remove nora cost of previous ability
                    // add nora cost of selected ability
                    const selected = i === indexAbility
                    if (ability.selected)
                        this.selectedRune.noraCost -= ability.noraCost
                    ability.selected = selected
                    if (ability.selected)
                        this.selectedRune.noraCost += ability.noraCost
                })
            }
        },
    },
})
