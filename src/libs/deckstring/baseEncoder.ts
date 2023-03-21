const BASE61_ALPHABET =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export const encodeBase61 = (number: number): string => {
    if (number < 0) throw new Error('Number must be positive')
    if (number === 0) return '00'

    if (number <= 3721) {
        // If number is less than or equal to 3721, only encode using two characters
        const remainder = number % 61
        const firstChar = BASE61_ALPHABET.charAt(Math.floor(number / 61))
        const secondChar = BASE61_ALPHABET.charAt(remainder)
        return firstChar + secondChar
    }

    let result = ''
    while (number > 0) {
        const remainder = number % 61
        result = BASE61_ALPHABET.charAt(remainder) + result
        number = Math.floor(number / 61)
    }

    // Add padding zeros
    const paddingLength = Math.ceil(result.length / 3) * 3 - result.length
    const paddingZeros = '0'.repeat(paddingLength)
    result = paddingZeros + result

    return result
}

export const decodeBase61 = (encodedString: string): number => {
    if (!encodedString) throw new Error('Encoded string must not be empty')

    // Remove padding zeros
    encodedString = encodedString.replace(/^0+/, '')

    let number = 0
    for (let i = 0; i < encodedString.length; i++) {
        const index = BASE61_ALPHABET.indexOf(encodedString.charAt(i))
        if (index === -1)
            throw new Error('Invalid character found in encoded string')
        number = number * 61 + index
    }

    return number
}
