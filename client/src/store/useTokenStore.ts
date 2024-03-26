import {createWithEqualityFn} from "zustand/traditional";
import {persist} from "zustand/middleware";
import {getAccount, getChain} from "@/utils/clients.ts";
import {$tokenContract} from "@/utils/contracts.ts";

const tokenContract = $tokenContract.value

interface BalanceStore {
    balance: bigint | undefined

    mint: (amount: bigint) => Promise<void>
    burn: (amount: bigint) => Promise<void>
}

const account = await getAccount()
const chain = await getChain()

export const useTokenStore = createWithEqualityFn<BalanceStore>()(
    persist(
        (set, get) => ({
            balance: undefined,
            mint: async (amount: bigint) => {
                if (!account) {
                    return
                }
                tokenContract.write?.mint([amount], {account: account.address, chain: chain})
            },
            burn: async (amount: bigint) => {
                if (!account) {
                    return
                }
                tokenContract.write?.burn([amount], {account: account.address, chain: chain})
            },
        }),
        {
            name: 'token'
        }
    )
)