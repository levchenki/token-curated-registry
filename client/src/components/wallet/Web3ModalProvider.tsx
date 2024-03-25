import {ReactNode} from "react";
import {WagmiProvider} from "wagmi";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {wagmiConfig} from "@/config/wagmi-config.tsx";

const queryClient = new QueryClient()

interface Web3ModalProviderProps {
    children: ReactNode
}

export function Web3ModalProvider({children}: Web3ModalProviderProps) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}