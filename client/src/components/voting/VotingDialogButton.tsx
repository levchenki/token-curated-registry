import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useEffect, useState} from "react";
import {IVotingItem} from "@/types/interfaces.ts";
import {stringifyBigInt} from "@/utils/helpers.ts";
import {Link} from "react-router-dom";
import {useVotingStore} from "@/store/useVotingStore.ts";
import {errorToast, toast} from "@/components/ui/use-toast.ts";
import {useTokenStore} from "@/store/useTokenStore.ts";

interface IVotingDialogProps {
    isDisabled: boolean
    votingItem: IVotingItem
    address?: `0x${string}`
}

export const VotingDialogButton = ({isDisabled, votingItem, address}: IVotingDialogProps) => {
    const [isVoted, setIsVoted] = useState(false)
    const [isApproval, setIsApproval] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const {vote} = useVotingStore(state => ({
        vote: state.vote
    }))
    const {balance} = useTokenStore((state) => ({
        balance: state.balance
    }))

    const VOTE_COST = 5n * BigInt(1e18)

    const descriptionMessage = votingItem.votingReason === 'APPLICATION'
        ? 'Are you voting to approve or reject this application?'
        : 'Are you voting to keep or remove this item from the registry?'


    const onVoteClick = (isApproval: boolean) => {
        if (!address) return

        if (balance && balance < VOTE_COST) {
            errorToast('You do not have enough TKN to vote')
            return
        }

        vote(votingItem, isApproval, address).then(() => {
            toast({
                title: 'Success',
                description: 'Your vote has been accepted',
            })
            setIsOpen(false)
        }).catch(e => {
            errorToast(e.message)
        })
    }

    useEffect(() => {
        if (address) {
            const approvalUserVote = votingItem.votesForObject.find(v => v.voterAddress === address)
            const rejectedUserVote = votingItem.votesForInitiator.find(v => v.voterAddress === address)
            setIsVoted(!!(approvalUserVote || rejectedUserVote));
            setIsApproval(!approvalUserVote)
        }
    }, [votingItem, address]);


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant='outline' disabled={isDisabled || isVoted || votingItem.initiator === address}
                        size='sm'>
                    {
                        isVoted ? <p>
                            You have already voted for
                            <span className={isApproval ? 'text-primary' : 'text-destructive'}>
                                    {isApproval
                                        ? votingItem.votingReason === 'APPLICATION' ? ' "Approve"' : ' "Keep"'
                                        : votingItem.votingReason === 'APPLICATION' ? ' "Reject"' : ' "Remove"'}
                                </span>
                        </p> : (votingItem.initiator === address)
                            ? <p>You're the initiator of this voting</p>
                            : <p>
                                Vote
                            </p>
                    }
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        <Link to={votingItem.link}
                              target='_blank'>
                                <span className='text-primary hover:pointer hover:underline'>
                                    {votingItem.name}
                                </span>
                        </Link>
                    </DialogTitle>
                    <DialogDescription>
                        {descriptionMessage} You'll spend {stringifyBigInt(VOTE_COST)} TKN for your vote.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='mt-5'>
                    <Button variant='outline'
                            onClick={() => onVoteClick(true)}
                            disabled={isDisabled}>
                        {votingItem.votingReason === 'APPLICATION' ? 'Approve' : 'Keep'}
                    </Button>
                    <Button variant='outline'
                            onClick={() => onVoteClick(false)}
                            disabled={isDisabled}>
                        {votingItem.votingReason === 'APPLICATION' ? 'Reject' : 'Remove'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}