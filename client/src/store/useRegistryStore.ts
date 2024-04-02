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
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 6',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 7',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 8',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 9',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 10',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 11',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 12',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 13',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 14',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 15',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 16',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 17',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 18',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 19',
                    link: 'https://google.com',
                },
                {
                    address: '0x9876543210',
                    name: 'Registry 20',
                    link: 'https://google.com',
                }
            ]
        })
    }
}))
