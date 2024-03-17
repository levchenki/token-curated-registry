import {ReactNode} from "react";
import {WagmiProvider} from "wagmi";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createWeb3Modal} from "@web3modal/wagmi/react";
import {wagmiConfig} from "@/config/wagmi-config.tsx";
import {getSystemTheme} from "@/components/theme/ThemeProvider.tsx";


const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const queryClient = new QueryClient()

const theme = localStorage.getItem('vite-ui-theme') ?? getSystemTheme()

export const web3Modal = createWeb3Modal({
    wagmiConfig: wagmiConfig,
    projectId,
    themeMode: theme as 'light' | 'dark',
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