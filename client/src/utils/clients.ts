import {sepolia} from "wagmi/chains";
import {signal} from "@preact/signals-react";
import {WalletClient} from "viem";
import {wagmiConfig} from "@/config/wagmi-config.tsx";
import {GetAccountReturnType, getWalletClient, watchAccount} from "wagmi/actions";


watchAccount(wagmiConfig, {
    async onChange(data: GetAccountReturnType) {
        const status = data.status;

        if (status === 'connected') {
            $walletClient.value = await getWalletClient(wagmiConfig);
        } else {
            $walletClient.value = undefined
        }
    }
})

export const $walletClient = signal<WalletClient | undefined>(undefined);
export const publicClient = wagmiConfig.getClient({chainId: sepolia.id})
