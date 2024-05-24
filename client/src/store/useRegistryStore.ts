import {create} from "zustand";
import {IRegistryItem} from "@/types/interfaces.ts";

interface IRegistryStore {
    isRegistryFetching: boolean
    registry: IRegistryItem[]
    getRegistry: () => Promise<void>
}

export const useRegistryStore = create<IRegistryStore>((set) => ({
    isRegistryFetching: false,
    registry: [],
    getRegistry: async () => {
        set({
            registry: [
                {
                    address: '0x1234567890',
                    name: 'NanaZip',
                    link: 'https://github.com/M2Team/NanaZip',
                },
                {
                    address: '0x0987654321',
                    name: 'doublecmd',
                    link: 'https://github.com/doublecmd/doublecmd',
                },
                {
                    address: '0x1357924680',
                    name: 'Flow.Launcher',
                    link: 'https://github.com/Flow-Launcher/Flow.Launcher',
                },
                {
                    address: '0x2468135790',
                    name: 'Files',
                    link: 'https://github.com/files-community/Files',
                },
                {
                    address: '0x24681357902',
                    name: 'Shadowsocks',
                    link: 'https://github.com/shadowsocks/shadowsocks-windows',
                },
            ]
        })
    }
}))
