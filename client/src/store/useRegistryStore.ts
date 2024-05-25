import {create} from "zustand";
import {IRegistryItem} from "@/types/interfaces.ts";

interface IRegistryStore {
    isRegistryFetching: boolean
    registry: IRegistryItem[]
    getRegistry: () => Promise<void>
    challengeRegistryItem: (registryItem: IRegistryItem) => Promise<void>
}

export const useRegistryStore = create<IRegistryStore>((set) => ({
    isRegistryFetching: false,
    registry: [],
    getRegistry: async () => {
        set({
            registry: [
                {
                    address: '0x12534567890',
                    name: 'NanaZip',
                    link: 'https://github.com/M2Team/NanaZip',
                    addedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
                    status: 'ACTIVE'
                },
                {
                    address: '0x09876154321',
                    name: 'doublecmd',
                    link: 'https://github.com/doublecmd/doublecmd',
                    addedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
                    status: 'ACTIVE'
                },
                {
                    address: '0x13579624680',
                    name: 'Flow.Launcher',
                    link: 'https://github.com/Flow-Launcher/Flow.Launcher',
                    addedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
                    status: 'ACTIVE'
                },
                {
                    address: '0x24681350790',
                    name: 'Files',
                    link: 'https://github.com/files-community/Files',
                    addedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
                    status: 'ACTIVE'
                },
                {
                    address: '0x246813517902',
                    name: 'Shadowsocks',
                    link: 'https://github.com/shadowsocks/shadowsocks-windows',
                    addedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
                    status: 'ACTIVE'
                },
            ]
        })
    },
    challengeRegistryItem: async (registryItem) => {
        set(state => ({
            registry: state.registry.map(item => (item.address === registryItem.address ? {
                ...item,
                status: 'CHALLENGING'
            } : item))
        }))
    }
}))