interface IEvent {
    address: `0x${string}`
    transactionHash: `0x${string}`
}

export interface IDepositEvent extends IEvent {
    amount?: bigint
    sender?: `0x${string}`
}


export interface IRegistryItem {
    address: `0x${string}`
    name: string
    link: string
}