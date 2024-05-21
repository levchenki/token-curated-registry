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
                    name: 'Registry 1',
                    link: 'https://google.com',
                },
                {
                    address: '0x0987654321',
                    name: 'Registry 2',
                    link: 'https://google.com',
                },
                {
                    address: '0x1357924680',
                    name: 'Registry 3',
                    link: 'https://google.com',
                },
                {
                    address: '0x2468135790',
                    name: 'Registry 4',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 5',
                    link: 'https://google.com',
                }
            ]
        })
    }
}))
