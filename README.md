# :black_joker: Poxfield

If you're looking for a user-friendly and efficient way to construct decks in Poxnora, look no further than my comprehensive deckbuilder.

## :eyes: Overview

<img src="https://user-images.githubusercontent.com/44639352/227801280-0d4324e3-6fde-4471-ae40-bc9e23f98c6d.png" width="500px">

<img src="https://user-images.githubusercontent.com/44639352/227800757-87dcf392-34c8-4676-a5c6-5e06e443ae69.gif" width="500px">

# Table of contents

- [:black_joker: Poxfield](#black_joker-poxfield)
  - [:eyes: Overview](#eyes-overview)
  - [:thread: Deckstring Info](#thread-deckstring-info)
  - [:balance_scale: Legal](#balance_scale-legal)
  - [:crossed_swords: Competition & Inspiration](#crossed_swords-competition--inspiration)
  - [:nerd_face: Stack](#nerd_face-stack)
  - [:derelict_house: Design Plan](#derelict_house-design-plan)

## :thread: Deckstring Info
Deckstrings are a compact way to represent a deck of cards using a Base62 encoding. The deckstring format separates different card types (champions, spells, equipment, and relics) with hyphens. Champions have an additional character to encode their abilities.

### Structure
A deckstring has the following structure:

[champions]-[spells]-[equipment]-[relics]

Each section represents a type of card, and each card within a section is represented by its Base62 encoded ID. The encoded IDs for each card type are concatenated together to form a single string.

### Example
Deckstring: [AYCAYC4OC4OCLg13pB2w14Z01GC1H1QcBSZ1IsMSc07Q2-6T2m200Z8X1y0i6A1f-1w0l2V-4A0d24](https://sebakocz.github.io/poxfield/?deck=AYCAYC4OC4OCLg13pB2w14Z01GC1H1QcBSZ1IsMSc07Q2-6T2m200Z8X1y0i6A1f-1w0l2V-4A0d24)

This deckstring can be broken down into the following sections:
- Champions: AYCAYC4OC4OCLg13pB2w14Z01GC1H1QcBSZ1IsMSc07Q2
- Spells: 6T2m200Z8X1y0i6A1f
- Equipment: 1w0l2V
- Relics: 4A0d24

### Champions and Abilities
Champions are a special case since they also have abilities. The abilities are encoded as an additional Base62 character after the champion's ID. The first two characters represent the champion's ID, while the third character represents the encoded abilities.

For example, in the champions section of the example deckstring, AYC represents a champion with ID AY (=2292) and abilities encoded as C (=38 /TODO ???).

## :balance_scale: Legal

The code base undergoes the [MIT License](https://github.com/sebakocz/poxfield/blob/master/LICENSE.md)

All data and images related to Poxnora on this website are property of Desert Owl INC.

## :crossed_swords: Competition & Inspiration
- [Poxala](https://poxala-fa4ce.web.app/runes) - deck builder made by a community member
- [PoxRaze](https://blacr7.github.io/PoxRaze/) - extended search made by a community member
- [PoxBase](https://poxbase.net/) - pure search egine, great UI
- [Poxpulse](https://github.com/winsomniak/poxpulse.com) - deprecated
- [Moxfield](https://www.moxfield.com/) - professional mtg deck builder & more
- [Great source of deck builders](https://www.similarweb.com/website/moxfield.com/competitors/)

## :nerd_face: Stack
- :green_heart::pineapple: Vite + Vue + Typescript + Pinia
- :octocat::page_facing_up: static hosted files on Github Pages

If you want to contribute, simply run these:
```
> npm install
> npm run dev
```

## :derelict_house: Design Plan

Main Frames
<img src="https://user-images.githubusercontent.com/44639352/224578422-33b2be7c-fef2-48c4-ba4c-0792e41e8472.png" width="500px">

-----
Rune Info Modal
<img src="https://user-images.githubusercontent.com/44639352/224578422-33b2be7c-fef2-48c4-ba4c-0792e41e8472.png" width="500px">
