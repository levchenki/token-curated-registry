import {IVote, IVotingItem, VotingReason} from "@/types/interfaces.ts";
import {create} from "zustand";

interface IVotingStore {
    isLoaded: boolean,
    votingList: IVotingItem[],
    getVotingList: () => Promise<void>,
    addNewVoting: (address: `0x${string}`,
                   name: string,
                   link: string,
                   deposit: bigint,
                   initiator: `0x${string}`,
                   reason: VotingReason) => Promise<void>
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
                        votesForObject: [
                            {voterAddress: '0x1'},
                            {voterAddress: '0x2'},
                            {voterAddress: '0x3'},
                            {voterAddress: '0x4'},
                            {voterAddress: '0x5'},
                            {voterAddress: '0x6'},
                            {voterAddress: '0x7'},
                            {voterAddress: '0x8'},
                            {voterAddress: '0x9'},
                            {voterAddress: '0x10'},
                        ],
                        votesForInitiator: [
                            {voterAddress: '0x1'},
                            {voterAddress: '0x2'},
                            {voterAddress: '0x3'},
                            {voterAddress: '0x4'},
                            {voterAddress: '0x5'},
                            {voterAddress: '0x6'},
                            {voterAddress: '0x7'},
                            {voterAddress: '0x8'},
                            {voterAddress: '0x9'},
                            {voterAddress: '0x10'},
                            {voterAddress: '0x11'},
                            {voterAddress: '0x12'},
                        ],
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
                        votesForObject: [
                            {voterAddress: '0x1'},
                            {voterAddress: '0x2'},
                            {voterAddress: '0x3'},
                            {voterAddress: '0x4'},
                            {voterAddress: '0x5'},
                            {voterAddress: '0x6'},
                            {voterAddress: '0x7'},
                            {voterAddress: '0x8'},
                            {voterAddress: '0x9'},
                            {voterAddress: '0x10'},
                            {voterAddress: '0x11'},
                            {voterAddress: '0x12'},
                            {voterAddress: '0x13'},
                            {voterAddress: '0x14'},
                            {voterAddress: '0x15'},
                        ],
                        votesForInitiator: [
                            {voterAddress: '0x1'},
                            {voterAddress: '0x2'},
                            {voterAddress: '0x3'},
                            {voterAddress: '0x4'},
                            {voterAddress: '0x5'},
                            {voterAddress: '0x6'},
                            {voterAddress: '0x7'},
                            {voterAddress: '0x8'},
                            {voterAddress: '0x9'},
                            {voterAddress: '0x10'},
                            {voterAddress: '0x11'},
                            {voterAddress: '0x12'},
                            {voterAddress: '0x13'},
                            {voterAddress: '0x14'},
                            {voterAddress: '0x15'},
                        ],
                        description: 'Netch is an open-source game accelerator and proxy designed for Windows, offering features like speed optimization, traffic compression, and proxy support.'
                    },
                    {
                        address: '0x09813667654321',
                        name: 'haoel.github.io',
                        link: 'https://github.com/haoel/haoel.github.io',
                        deposit: 200n * BigInt(1e18),
                        status: 'ACTIVE',
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
    addNewVoting: async (address,
                         name,
                         link,
                         deposit,
                         initiator,
                         reason) => {
        set(state => ({
            votingList: [
                {
                    address: address,
                    name: name,
                    link: link,
                    deposit: deposit,
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