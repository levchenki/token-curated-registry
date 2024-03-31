import {createConfig, http} from 'wagmi'
import {sepolia} from 'wagmi/chains'
import {coinbaseWallet, injected, walletConnect} from 'wagmi/connectors'


const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const metadata = {
    name: 'Token Curated Registry',
    description: 'Token Curated Registry wallet',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const sepoliaTransport = http(`https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`)

export const wagmiConfig = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: sepoliaTransport,
    },
    connectors: [
        walletConnect({projectId, metadata, showQrModal: false}),
        injected({shimDisconnect: true}),
        coinbaseWallet({
            appName: metadata.name,
            appLogoUrl: metadata.icons[0]
        }),
    ]
});
