import React from 'react'
import ReactDOM from 'react-dom/client'

import '@/index.css'
import {ThemeProvider} from "@/components/theme/ThemeProvider.tsx";
import App from "@/App.tsx";
import { Web3ModalProvider } from './components/wallet/web3-modal-provider';



ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
            <Web3ModalProvider>
                <App/>
            </Web3ModalProvider>
        </ThemeProvider>
    </React.StrictMode>,
)
