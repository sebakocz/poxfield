// Define the Base62 alphabet
const BASE62_ALPHABET =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

/**
 * Encodes a positive integer number to a Base62 string with exactly two characters.
 * Note: The input number should be in the range of 0 to 3721 (inclusive) to ensure
 * the output string is exactly two characters long.
 *
 * @param number The number to be encoded.
 * @returns The Base62 encoded string.
 */
export const encodeBase62 = (number: number): string => {
    if (number < 0) throw new Error('Number must be positive')
    if (number > 3721)
        throw new Error('Number must be less than or equal to 3721')

    const remainder = number % 62
    const firstChar = BASE62_ALPHABET.charAt(Math.floor(number / 62))
    const secondChar = BASE62_ALPHABET.charAt(remainder)
    return firstChar + secondChar
}

/**
 * Decodes a Base62 encoded string back to a positive integer number.
 *
 * @param encodedString The Base62 encoded string to be decoded.
 * @returns The decoded number.
 */
export const decodeBase62 = (encodedString: string): number => {
    if (!encodedString) throw new Error('Encoded string must not be empty')

    let number = 0
    for (let i = 0; i < encodedString.length; i++) {
        const index = BASE62_ALPHABET.indexOf(encodedString.charAt(i))
        if (index === -1)
            throw new Error('Invalid character found in encoded string')
        number = number * 62 + index
    }

    return number
}
