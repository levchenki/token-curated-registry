import {IApplicationItem, IVotingItem, VotingReason} from "@/types/interfaces.ts";
import {create} from "zustand";

interface IVotingStore {
    isLoaded: boolean,
    votingList: IVotingItem[],
    getVotingList: () => Promise<void>,
    addNewVoting: (application: IApplicationItem, initiator: `0x${string}`, reason: VotingReason) => Promise<void>
}

export const useVotingStore = create<IVotingStore>((set, get) => ({
    votingList: [],
    isLoaded: false,
    getVotingList: async () => {
        if (!get().isLoaded) {
            set({
                isLoaded: true,
                votingList: [
                    {
                        address: '0x1234567890',
                        name: 'Voting 1',
                        link: 'https://github.com',
                        deposit: 100n * BigInt(1e18),
                        status: 'ACTIVE',
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                        initiator: '0x1234567890',
                        votingReason: 'APPLICATION'
                    },
                    {
                        address: '0x0987654321',
                        name: 'Voting 2',
                        link: 'https://github.com',
                        deposit: 200n * BigInt(1e18),
                        status: 'APPROVED',
                        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
                        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
                        initiator: '0x1234567890',
                        votingReason: 'MEMBERSHIP'
                    },
                    {
                        address: '0x1357924680',
                        name: 'Voting 3',
                        link: 'https://github.com',
                        deposit: 300n * BigInt(1e18),
                        status: 'DENIED',
                        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
                        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
                        initiator: '0x1234567890',
                        votingReason: 'APPLICATION'
                    },
                    {
                        address: '0x2468135790',
                        name: 'Voting 4',
                        link: 'https://github.com',
                        deposit: 400n * BigInt(1e18),
                        status: 'ACTIVE',
                        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
                        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
                        initiator: '0x1234567890',
                        votingReason: 'MEMBERSHIP'
                    },
                    {
                        address: '0x9876543210',
                        name: 'Voting 5',
                        link: 'https://github.com',
                        deposit: 500n * BigInt(1e18),
                        status: 'APPROVED',
                        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
                        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
                        initiator: '0x1234567890',
                        votingReason: 'APPLICATION'
                    }
                ]
            })

        }
    },
    addNewVoting: async (application, initiator, reason) => {
        set(state => ({
            votingList: [
                {
                    address: application.address,
                    name: application.name,
                    link: application.link,
                    deposit: application.deposit,
                    status: 'ACTIVE',
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                    initiator,
                    votingReason: reason,
                },
                ...state.votingList,
            ]
        }))
    }
}))