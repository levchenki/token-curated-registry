interface Event {
    address: `0x${string}`
    transactionHash: `0x${string}`
}

export interface DepositEvent extends Event {
    amount?: bigint
    sender?: `0x${string}`
}