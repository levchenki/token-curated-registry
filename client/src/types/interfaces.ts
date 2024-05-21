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


export type ApplicationStatus = 'OPEN' | 'CLOSED'

export interface IApplicationItem {
    address: `0x${string}`
    name: string
    link: string
    deposit: bigint,
    startDate: Date,
    endDate: Date,
    status: ApplicationStatus
}

export type VotingStatus = 'ACTIVE' | 'APPROVED' | 'DENIED'
export type VotingType = 'APPLICATION' | 'MEMBERSHIP'

export interface IVotingItem {
    address: `0x${string}`
    name: string
    link: string
    deposit: bigint,
    status: VotingStatus
    startDate: Date,
    endDate: Date,
    initiator: `0x${string}`
    votingType: VotingType
}