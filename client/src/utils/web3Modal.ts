import {wagmiConfig} from "@/config/wagmi-config.tsx";
import {getSystemTheme} from "@/components/theme/ThemeProvider.tsx";
import {createWeb3Modal} from "@web3modal/wagmi/react";

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const theme = localStorage.getItem('vite-ui-theme') ?? getSystemTheme()


export const web3Modal = createWeb3Modal({
    wagmiConfig: wagmiConfig,
    projectId,
    themeMode: theme as 'light' | 'dark',
})