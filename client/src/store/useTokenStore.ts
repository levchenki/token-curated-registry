import {createWithEqualityFn} from "zustand/traditional";
import {persist} from "zustand/middleware";
import {$account, $chain} from "@/utils/clients.ts";
import {$tokenContract} from "@/utils/contracts.ts";


interface BalanceStore {
    balance: bigint | undefined

    mint: (amount: bigint) => Promise<void>
    burn: (amount: bigint) => Promise<void>
    getMintReward: (amount: bigint) => Promise<bigint>
    getBurnRefund: (amount: bigint) => Promise<bigint>
}

export const useTokenStore = createWithEqualityFn<BalanceStore>()(
    persist(
        (set, get) => ({
            balance: undefined,
            burn: async (amount: bigint) => {
                const tokenContract = $tokenContract.peek()
                const account = $account.peek()
                const chain = $chain.peek()

                if (!account) {
                    return
                }
                console.log(amount)
                await tokenContract.write.burn([amount], {account: account.address, chain})
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
                const tokenContract = $tokenContract.peek()
                const account = $account.peek()
                const chain = $chain.peek()

                if (!account) {
                    return
                }
                console.log(amount)
                await tokenContract.write.mint([amount], {account: account.address, chain})
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