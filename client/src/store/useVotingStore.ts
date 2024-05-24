import {IApplicationItem, IVote, IVotingItem, VotingReason} from "@/types/interfaces.ts";
import {create} from "zustand";

interface IVotingStore {
    isLoaded: boolean,
    votingList: IVotingItem[],
    getVotingList: () => Promise<void>,
    addNewVoting: (application: IApplicationItem, initiator: `0x${string}`, reason: VotingReason) => Promise<void>
    vote: (votingItem: IVotingItem,
           isApproval: boolean,
           voterAddress: `0x${string}`) => Promise<void>
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
                        name: 'GyrosVPN',
                        link: 'https://github.com',
                        deposit: 100n * BigInt(1e18),
                        status: 'ACTIVE',
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                        initiator: '0x1234567890',
                        votingReason: 'APPLICATION',
                        votesForObject: [],
                        votesForInitiator: [],
                    },
                    {
                        address: '0x0987654321',
                        name: 'netch',
                        link: 'https://github.com/netchx/netch',
                        deposit: 200n * BigInt(1e18),
                        status: 'APPROVED',
                        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
                        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
                        initiator: '0x1234567890',
                        votingReason: 'MEMBERSHIP',
                        votesForObject: [],
                        votesForInitiator: [],
                    },
                    {
                        address: '0x1357924680',
                        name: 'shadowsocks',
                        link: 'https://github.com/shadowsocks/shadowsocks-windows',
                        deposit: 300n * BigInt(1e18),
                        status: 'DENIED',
                        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
                        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
                        initiator: '0x1234567890',
                        votingReason: 'APPLICATION',
                        votesForObject: [],
                        votesForInitiator: [],
                    },
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
                    votesForObject: [],
                    votesForInitiator: [],
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                    initiator,
                    votingReason: reason,
                },
                ...state.votingList,
            ]
        }))
    },
    vote: async (votingItem,
                 isApproval,
                 voterAddress) => {

        const vote: IVote = {voterAddress: voterAddress}

        const votingList = get().votingList.map(v => {
            if (v.address === votingItem.address) {

                if (v.votesForObject.find(vote => vote.voterAddress === voterAddress)
                    || v.votesForInitiator.find(vote => vote.voterAddress === voterAddress)) {
                    throw new Error('You have already voted')
                }

                if (isApproval) {
                    return {
                        ...v,
                        votesForInitiator: [...v.votesForInitiator, vote]
                    }
                } else {
                    return {
                        ...v,
                        votesForObject: [...v.votesForObject, vote]
                    }
                }
            }
            return v
        })

        set({votingList})
    }
}))