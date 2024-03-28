import {createWithEqualityFn} from "zustand/traditional";
import {persist} from "zustand/middleware";
import {$account, $chain} from "@/utils/clients.ts";
import {$tokenContract} from "@/utils/contracts.ts";


interface BalanceStore {
    isMinting: boolean
    isBurning: boolean

    mint: (amount: bigint) => Promise<void>
    burn: (amount: bigint) => Promise<void>
    getMintReward: (amount: bigint) => Promise<bigint>
    getBurnRefund: (amount: bigint) => Promise<bigint>
}

export const useTokenStore = createWithEqualityFn<BalanceStore>()(
    persist(
        (set) => ({
            isMinting: false,
            isBurning: false,
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

                await tokenContract.write.deposit([amount], {account: account.address, chain})
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
        }),
        {
            name: 'token'
        }
    )
)