import {createWithEqualityFn} from "zustand/traditional";
import {persist} from "zustand/middleware";
import {$account, $chain} from "@/utils/clients.ts";
import {$tokenContract} from "@/utils/contracts.ts";


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

    getMintReward: (amount: bigint) => Promise<bigint>
    getBurnRefund: (amount: bigint) => Promise<bigint>

    getIsActivePeriod: () => Promise<boolean>
    getIsOwner: (address: `0x${string}` | undefined) => Promise<boolean>

    isListeningBalance: boolean
    listenBalance: (address: `0x${string}` | undefined) => Promise<void>
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

                set({balance: BigInt(balanceOf)})
                set({isFetchingBalance: false})
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
                        console.log(logs)
                        logs.map((log) => {
                            console.log(log)
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
        }),
        {
            name: 'token',
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(([key]) => {
                        return !['balance', 'isListeningBalance'].includes(key);
                    }),
                ),
        }
    )
)