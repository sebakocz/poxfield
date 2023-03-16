import { Rune } from '@src/api/poxApiDto'

export enum ApiEndpoints {
    GET_ALL_RUNES = 'https://raw.githubusercontent.com/sebakocz/poxfield/json-data/runes.json',
}

const cloudfrontUrl = 'https://d2aao99y1mip6n.cloudfront.net'

export const getRuneImgSmall = (hash: string) => {
    // example: https://d2aao99y1mip6n.cloudfront.net/images/runes/sm/eJ8JJ8IF0AE8De9AF0BJ8HJ8Iygygpfrzxvhygn.png
    return `${cloudfrontUrl}/images/runes/sm/${hash}.png`
}

export const getRuneImgMedium = (hash: string) => {
    // example: https://d2aao99y1mip6n.cloudfront.net/images/runes/med/dJ8HJ8Ge9BF0AE8Dj9Ej9Fj9Geruztosmjpjpyxf.jpg
    return `${cloudfrontUrl}/images/runes/med/${hash}.jpg`
}

const frameTypeMapper = (rarity: Rune['rarity']) => {
    switch (rarity) {
        case 'COMMON':
            return 'com'
        case 'UNCOMMON':
            return 'uncom'
        case 'RARE':
            return 'rare'
        case 'LEGENDARY':
            return 'pe'
        case 'EXOTIC':
            return 'exotic'
    }
}

export const getRarityFrameImg = (rarity: Rune['rarity']) => {
    // example: https://d2aao99y1mip6n.cloudfront.net/_themes/global/frames/small/sm_frame_rarity_uncom.gif
    const type = frameTypeMapper(rarity)
    return `${cloudfrontUrl}/_themes/global/frames/small/sm_frame_rarity_${type}.gif`
}

export const getBackgroundFrameImg = () => {
    // example: https://d2aao99y1mip6n.cloudfront.net/_themes/global/frames/small/front/1.gif
    return `${cloudfrontUrl}/_themes/global/frames/small/front/1.gif`
}

export const getIconsFrameImg = () => {
    // example: https://d2aao99y1mip6n.cloudfront.net/_themes/global/frames/small/rune_stats.png
    return `${cloudfrontUrl}/_themes/global/frames/small/rune_stats.png`
}
