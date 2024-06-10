import {createWithEqualityFn} from "zustand/traditional";
import {persist} from "zustand/middleware";
import {$account, $chain} from "@/utils/clients.ts";
import {$tokenContract} from "@/utils/contracts.ts";
import {IDepositEvent} from "@/types/interfaces.ts";


interface BalanceStore {
    isMinting: boolean
    isBurning: boolean

    isFetchingBalance: boolean
    balance?: bigint
    getBalance: (address: `0x${string}` | undefined) => Promise<void>

    burn: (amount: bigint) => Promise<void>
    deposit: (amount: bigint) => Promise<void>
    distribute: (from: `0x${string}` | undefined, isActive: boolean | undefined) => Promise<void>
    mint: (amount: bigint) => Promise<void>

    spend: (amount: bigint) => Promise<void>

    getMintReward: (amount: bigint) => Promise<bigint>
    getBurnRefund: (amount: bigint) => Promise<bigint>

    getIsActivePeriod: () => Promise<boolean>
    getIsOwner: (address: `0x${string}` | undefined) => Promise<boolean>

    isListeningBalance: boolean
    listenBalance: (address: `0x${string}` | undefined) => Promise<void>

    isFetchingDeposits: boolean
    deposits: IDepositEvent[]
    getDeposits: () => Promise<void>
    isListeningDeposits: boolean
    listenDeposits: () => Promise<void>
}

export const useTokenStore = createWithEqualityFn<BalanceStore>()(
    persist(
        (set, get) => ({
            isMinting: false,
            isBurning: false,

            isFetchingBalance: false,
            balance: undefined,

            getBalance: async (address: `0x${string}` | undefined) => {
                const tokenContract = $tokenContract.peek()

                if (!address) {
                    return
                }

                set({isFetchingBalance: true})

                const balanceOf = await tokenContract.read.balanceOf([address])

                set({balance: BigInt(balanceOf), isFetchingBalance: false})
            },

            spend: async (amount: bigint) => {
                const tokenContract = $tokenContract.peek()
                const account = $account.peek()
                const chain = $chain.peek()

                if (!account) {
                    return
                }

                await tokenContract.write.transfer([tokenContract.address, amount], {account: account.address, chain})
            },

            burn: async (amount: bigint) => {
                set({isBurning: true})
                const tokenContract = $tokenContract.peek()
                const account = $account.peek()
                const chain = $chain.peek()
                if (!account) {
                    return
                }

                console.log(amount)
                await tokenContract.write.burn([amount], {account: account.address, chain})
                    .finally(() => {
                        set({isBurning: false})
                    })
            },
            deposit: async (amount: bigint) => {
                const tokenContract = $tokenContract.peek()
                const account = $account.peek()
                const chain = $chain.peek()

                if (!account) {
                    return
                }

                console.log(amount)
                await tokenContract.write.deposit([amount], {account: account.address, chain})
            },
            distribute: async (from: `0x${string}` | undefined, isDistributable: boolean | undefined) => {
                const tokenContract = $tokenContract.peek()
                if (!from || !isDistributable) {
                    return
                }
                const accumulationDateEndEpoch = await tokenContract.read.accumulationDateEnd()
                const accumulationDateEnd = new Date(Number(accumulationDateEndEpoch) * 1000);
                if (accumulationDateEnd > new Date()) {
                    throw new Error(
                        `You will be able to distribute after the accumulation period ends. 
                         Please wait until ${accumulationDateEnd.toDateString()}`
                    )
                }
                await tokenContract.write.distribute({account: from, chain: $chain.peek()})
            },
            mint: async (amount: bigint) => {
                set({isMinting: true})
                const tokenContract = $tokenContract.peek()
                const account = $account.peek()
                const chain = $chain.peek()

                if (!account) {
                    return
                }

                console.log(amount)
                await tokenContract.write.mint([amount], {account: account.address, chain})
                    .finally(() => {
                        set({isMinting: false})
                    })
            },
            getMintReward: async (amount: bigint) => {
                const tokenContract = $tokenContract.peek()
                return await tokenContract.read.getContinuousMintReward([amount])
            },
            getBurnRefund: async (amount: bigint) => {
                const tokenContract = $tokenContract.peek()
                return await tokenContract.read.getContinuousBurnRefund([amount])
            },
            getIsActivePeriod: async () => {
                const tokenContract = $tokenContract.peek()
                return await tokenContract.read.isActive()
            },
            getIsOwner: async (address: `0x${string}` | undefined) => {
                if (!address) {
                    return false
                }
                const tokenContract = $tokenContract.peek()
                return await tokenContract.read.owner() === address
            },

            isListeningBalance: false,
            listenBalance: async (address: `0x${string}` | undefined) => {
                if (!address || get().isListeningBalance) {
                    return
                }
                console.log('listening balance')
                set({isListeningBalance: true})
                const tokenContract = $tokenContract.peek()

                tokenContract.watchEvent.Transfer({}, {
                    onLogs: (logs) => {
                        logs.map((log) => {
                            const {from, to, value} = log.args
                            if (!from || !to || !value) {
                                return
                            }

                            if (from === address) {
                                const diff = BigInt(value)
                                set((state) => {
                                    return {balance: state.balance ? state.balance - diff : state.balance}
                                })
                            }

                            if (to === address) {
                                const diff = BigInt(value)
                                set((state) => {
                                    return {balance: state.balance ? state.balance + diff : state.balance}
                                })
                            }
                        })
                    }
                })
            },

            isFetchingDeposits: false,
            deposits: [],
            getDeposits: async () => {
                const tokenContract = $tokenContract.peek()
                set({isFetchingDeposits: true})
                const depositedEvents = await tokenContract.getEvents.Deposited({fromBlock: 1n})
                const deposits = depositedEvents.map(d => {
                    const address = d.address
                    const transactionHash = d.transactionHash
                    const {amount, sender} = d.args
                    return {address, transactionHash, amount, sender}
                })
                deposits.reverse()
                set({deposits, isFetchingDeposits: false})
            },
            isListeningDeposits: false,
            listenDeposits: async () => {
                if (get().isListeningDeposits) {
                    return
                }
                console.log('listening deposits')
                set({isListeningDeposits: true})
                const tokenContract = $tokenContract.peek()

                tokenContract.watchEvent.Deposited({
                    onLogs: (logs) => {
                        const newDeposits = logs.map((log) => {
                            const {amount, sender} = log.args

                            return {
                                address: log.address,
                                transactionHash: log.transactionHash,
                                amount,
                                sender
                            }
                        })
                        set((state) => {
                            return {deposits: [...newDeposits, ...state.deposits]}
                        })
                    }
                })
            }
        }),
        {
            name: 'token',
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(([key]) => {
                        return !['balance', 'isListeningBalance', 'deposits', 'isListeningDeposits',].includes(key);
                    }),
                ),
        }
    )
)