import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {IVotingItem} from "@/types/interfaces.ts";
import {stringifyBigInt} from "@/utils/helpers.ts";
import {Link} from "react-router-dom";

interface IVotingDialogProps {
    isDisabled: boolean
    votingItem: IVotingItem
}

export const VotingDialogButton = ({isDisabled, votingItem}: IVotingDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const VOTE_COST = 5n * BigInt(1e18)

    const descriptionMessage = votingItem.votingReason === 'APPLICATION'
        ? 'Do you want to deny this application?'
        : 'Doy you want to remove this element from the registry?'

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant='outline' disabled={isDisabled}
                        size='sm'>
                    Vote
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
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button variant='outline' disabled={isDisabled}>No</Button>
                    <Button variant='outline' disabled={isDisabled}>Yes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}