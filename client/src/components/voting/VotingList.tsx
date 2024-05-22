import {useVotingStore} from "@/store/useVotingStore.ts";
import {VotingItem} from "@/components/voting/VotingItem.tsx";
import {useEffect} from "react";
import {useAccount} from "wagmi";

export const VotingList = () => {
    const {address} = useAccount()

    const {votingList, getVotingList} = useVotingStore(state => ({
        votingList: state.votingList,
        getVotingList: state.getVotingList
    }))

    useEffect(() => {
        getVotingList().catch(e => console.error(e));
    }, [getVotingList]);

    return (
        <div className='flex flex-col w-full md:w-6/12 gap-10 pt-3'>
            {votingList.map(v => (
                <VotingItem key={v.address} votingItem={v} address={address}/>
            ))}
        </div>
    )
}