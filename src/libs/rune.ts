export const setAbility = (
    rune: Rune,
    abilitySetIndex: number,
    abilityIndex: number
): void => {
    if (rune.type !== 'Champion') {
        console.dir(rune)
        throw new Error('Encoder: Rune is not a champion')
    }
    if (!rune.abilitySets) return

    const abilitySet = rune.abilitySets[abilitySetIndex]
    if (!abilitySet) {
        return
    }
    abilitySet.abilities.forEach((ability, index) => {
        const isSelected = index === abilityIndex

        if (ability.selected !== isSelected) {
            rune.noraCost += isSelected ? ability.noraCost : -ability.noraCost
            ability.selected = isSelected
        }
    })
}

import { Rune } from '@src/libs/api/poxDto'
