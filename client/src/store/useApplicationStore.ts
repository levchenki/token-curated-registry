import {IApplicationItem} from "@/types/interfaces.ts";
import {create} from "zustand";

interface IApplicationStore {
    isLoaded: boolean,
    applications: IApplicationItem[],
    getApplications: () => Promise<void>,
    addNewApplication: (address: `0x${string}`,
                        name: string,
                        link: string,
                        deposit: bigint) => Promise<void>
}

export const useApplicationStore = create<IApplicationStore>((set, get) => ({
    isLoaded: false,
    applications: [],
    getApplications: async () => {
        if (!get().isLoaded) {
            set({
                isLoaded: true,
                applications: [
                    {
                        address: '0x1234567890',
                        name: 'New amazing app 1',
                        link: 'https://github.com',
                        deposit: 100n * BigInt(1e18),
                        status: 'OPEN',
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                    },
                    {
                        address: '0x12345678901',
                        name: 'New amazing app 2',
                        link: 'https://github.com',
                        deposit: 100n * BigInt(1e18),
                        status: 'CLOSED',
                        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
                        endDate: new Date(),
                    },
                ]
            })
        }
    },
    addNewApplication: async (address, name, link, deposit) => {
        set(state => ({
            applications: [
                {
                    address,
                    name,
                    link,
                    deposit,
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                    status: 'OPEN'
                },
                ...state.applications,
            ]
        }))
    }
}))