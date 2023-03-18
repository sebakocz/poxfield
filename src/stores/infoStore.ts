import { defineStore } from 'pinia'
import { Champion, Equipment, Relic, Spell } from '@src/api/poxApiDto'

export const useInfo = defineStore({
    id: 'infoStore',
    state: () => ({
        selectedRune: null as Champion | Equipment | Relic | Spell | null,
    }),
    actions: {
        selectRune(rune: Champion | Equipment | Relic | Spell) {
            if ('abilitySets' in rune) {
                const champ = JSON.parse(JSON.stringify(rune)) as Champion
                champ.abilitySets.forEach((abilitySet) => {
                    abilitySet.abilities.forEach((ability) => {
                        ability.selected = ability.default
                    })
                })

                this.selectedRune = champ
                return
            }

            this.selectedRune = JSON.parse(JSON.stringify(rune))
        },
        clearSelectedRune() {
            this.selectedRune = null
        },
        setSelectedAbility(indexAbility: number, indexAbilitySet: number) {
            if (this.selectedRune && 'abilitySets' in this.selectedRune) {
                const abilities =
                    this.selectedRune.abilitySets[indexAbilitySet].abilities
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
