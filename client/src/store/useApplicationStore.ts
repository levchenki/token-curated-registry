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
    challengeApplication: (application: IApplicationItem) => Promise<void>
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
                        address: '0x12345678901',
                        name: 'New amazing app 1',
                        link: 'https://github.com',
                        deposit: 100n * BigInt(1e18),
                        status: 'OPEN',
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                    },
                    {
                        address: '0x12345678902',
                        name: 'New amazing app 2',
                        link: 'https://github.com',
                        deposit: 32n * BigInt(1e18),
                        status: 'CHALLENGING',
                        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
                        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
                    },
                    {
                        address: '0x12345678903',
                        name: 'New amazing app 3',
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
    },
    challengeApplication: async (application: IApplicationItem) => {
        set(state => ({
            applications: state.applications.map(a => {
                if (a.address === application.address && a.startDate == application.startDate) {
                    return {
                        ...a,
                        status: 'CHALLENGING',
                        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5)
                    }
                }
                return a
            })
        }))
    }
}))