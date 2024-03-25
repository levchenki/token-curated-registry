export const stringifyBigInt = (num: bigint | undefined): string => {
    if (!num) {
        return '...'
    }

    if (num === 0n) {
        return '0'
    }

    const decimals = 18
    const numStr = num.toString()
    const len = numStr.length

    if (len <= decimals) {
        return `0.${'0'.repeat(decimals - len)}${numStr}`
    }

    const integer = numStr.slice(0, len - decimals) || '0'
    const fraction = numStr.slice(len - decimals)
    return `${integer}.${fraction.slice(0, 4)}`
}