import {Separator} from "@/components/ui/separator.tsx";
import {VotingList} from "@/components/voting/VotingList.tsx";

export const VotingPage = () => {

    return (
        <>
            <h3 className='text-2xl font-bold'>Voting info</h3>
            <Separator className='w-80'/>
            <VotingList/>
        </>
    );
}