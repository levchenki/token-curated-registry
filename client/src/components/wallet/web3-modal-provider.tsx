import {ReactNode} from "react";
import {WagmiProvider} from "wagmi";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createWeb3Modal} from "@web3modal/wagmi/react";
import {wagmiConfig} from "@/wagmi-config.tsx";


const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const queryClient = new QueryClient()
createWeb3Modal({
    wagmiConfig: wagmiConfig,
    projectId,
    themeMode: 'dark',
})

interface Props {
    children: ReactNode
}

export function Web3ModalProvider({children}: Props) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}