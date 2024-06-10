interface IEvent {
    address: `0x${string}`
    transactionHash: `0x${string}`
}

export interface IDepositEvent extends IEvent {
    amount?: bigint
    sender?: `0x${string}`
}


export type RegistryItemStatus = 'ACTIVE' | 'CHALLENGING'

export interface IRegistryItem {
    address: `0x${string}`
    name: string
    link: string,
    addedDate: Date
    status: RegistryItemStatus
    description?: string
}


export type ApplicationStatus = 'OPEN' | 'CHALLENGING' | 'CLOSED'

export interface IApplicationItem {
    address: `0x${string}`
    name: string
    link: string
    deposit: bigint,
    startDate: Date,
    endDate: Date,
    status: ApplicationStatus
    description?: string
}

export type VotingStatus = 'ACTIVE' | 'APPROVED' | 'DENIED'
export type VotingReason = 'APPLICATION' | 'MEMBERSHIP'

export interface IVote {
    voterAddress: `0x${string}`
}

export interface IVotingItem {
    address: `0x${string}`
    name: string
    link: string
    deposit: bigint,
    status: VotingStatus
    startDate: Date,
    endDate: Date,
    initiator: `0x${string}`
    votingReason: VotingReason,
    votesForInitiator: IVote[],
    votesForObject: IVote[],
    description?: string
}