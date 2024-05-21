import Big from 'big.js';
import {SEPOLIA_ETHERSCAN_URL} from "@/utils/constants.ts";

export const stringifyBigInt = (num: bigint | undefined, isToFixed = false): string => {
    if (num === undefined) {
        return '...'
    }

    if (num === 0n) {
        return '0'
    }

    const decimals = 18
    const numStr = num.toString()
    const len = numStr.length
    const toFixed = 4
    if (len <= decimals) {
        const decimalStr = `0.${'0'.repeat(decimals - len)}${numStr}`;
        return isToFixed ? parseFloat(decimalStr).toFixed(toFixed) : parseFloat(decimalStr).toString()
    }

    const integer = numStr.slice(0, len - decimals) || '0'
    const fraction = numStr.slice(len - decimals)
    return `${integer}.${fraction.slice(0, toFixed)}`
}

export const NumberToBigInt = (num: number): bigint => {
    const bigNum = new Big(num);
    const multiplied = bigNum.times(Big(10).pow(18));
    return BigInt(multiplied.toFixed(0));
}

export const shortenAddress = (address: `0x${string}` | undefined): string => {
    if (!address) {
        return '...'
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const getEtherscanAddressLink = (address: `0x${string}`): string => {
    if (!address) {
        return ''
    }
    return `${SEPOLIA_ETHERSCAN_URL}/address/${address}`
}