import {useVotingStore} from "@/store/useVotingStore.ts";
import {VotingItem} from "@/components/voting/VotingItem.tsx";
import {useEffect} from "react";

export const VotingList = () => {
    const {votingList, getVotingList} = useVotingStore(state => ({
        votingList: state.votingList,
        getVotingList: state.getVotingList
    }))

    useEffect(() => {
        getVotingList().catch(e => console.error(e));
    }, [getVotingList]);

    return (
        <div className='flex flex-col w-5/6 md:w-2/5 gap-10 pt-3'>
            {votingList.map(v => (
                <VotingItem key={v.address} votingItem={v}/>
            ))}
        </div>
    )
}