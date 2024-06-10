import {IApplicationItem} from "@/types/interfaces.ts";
import {create} from "zustand";

interface IApplicationStore {
    isLoaded: boolean,
    applications: IApplicationItem[],
    getApplications: () => Promise<void>,
    addNewApplication: (address: `0x${string}`,
                        name: string,
                        link: string,
                        deposit: bigint,
                        description?: string) => Promise<void>
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
                        name: 'MiniCPM-V',
                        link: 'https://github.com/OpenBMB/MiniCPM-V',
                        deposit: 100n * BigInt(1e18),
                        status: 'OPEN',
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                        description: 'MiniCPM-V is a lightweight and efficient CP/M operating system emulator for Windows, designed to run classic CP/M programs and games.'
                    },
                    {
                        address: '0x12345678902',
                        name: 'netch',
                        link: 'https://github.com/netchx/netch',
                        deposit: 32n * BigInt(1e18),
                        status: 'CHALLENGING',
                        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
                        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
                        description: 'Netch is an open-source game accelerator and proxy designed for Windows, offering features like speed optimization, traffic compression, and proxy support.'
                    },
                    {
                        address: '0x12345678903',
                        name: 'shadowsocks',
                        link: 'https://github.com/shadowsocks/shadowsocks-windows',
                        deposit: 100n * BigInt(1e18),
                        status: 'CLOSED',
                        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
                        endDate: new Date(),
                        description: 'Shadowsocks for Windows is a secure socks5 proxy that can be used to bypass network censorship and access restricted online content.'
                    },
                ]
            })
        }
    },
    addNewApplication: async (address, name, link, deposit, description) => {
        set(state => ({
            applications: [
                {
                    address,
                    name,
                    link,
                    deposit,
                    description,
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