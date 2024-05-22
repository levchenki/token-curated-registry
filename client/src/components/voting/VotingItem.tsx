import {IVotingItem} from "@/types/interfaces.ts";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {getEtherscanAddressLink, shortenAddress, stringifyBigInt} from "@/utils/helpers.ts";
import {ExternalLink, Link as LinkIcon} from "lucide-react";

interface IVotingItemProps {
    votingItem: IVotingItem;
    address?: `0x${string}`
}

export const VotingItem = ({votingItem, address}: IVotingItemProps) => {
    const getStatus = () => {
        if (votingItem.status === 'ACTIVE') {
            return 'Active voting';
        } else if (votingItem.status === 'APPROVED') {
            return 'Approved voting';
        } else {
            return 'Denied voting';
        }
    }

    const getStatusColor = () => {
        if (votingItem.status === 'ACTIVE') {
            return 'text-yellow-500';
        } else if (votingItem.status === 'APPROVED') {
            return 'text-primary';
        } else {
            return 'text-destructive';
        }
    }

    const isDisabled = (v: IVotingItem) => {
        return v.status !== 'ACTIVE' || !address;
    }

    return (
        <div className='flex flex-col h-fit items-center px-4 pb-5 py-2 justify-between rounded-md border'>
            <div className='flex flex-row justify-between w-full items-center mt-2 px-3'>
                <div className='text-lg text-primary font-bold hover:underline underline-offset-4'>
                    <Link to={votingItem.link} target='_blank'>
                        <div className='flex items-center gap-3 text-md'>
                            <p>{votingItem.name}</p>
                            <LinkIcon className='w-4'/>
                        </div>
                    </Link>
                </div>
                <div className={`flex items-center gap-3 text-md ${getStatusColor()}`}>
                    {getStatus()}
                    <Link to={getEtherscanAddressLink(votingItem.address)}
                          target='_blank'
                          className='w-fit'>
                        <ExternalLink size={16}
                                      className='justify-self-start hover:cursor-pointer'/>
                    </Link>
                </div>
            </div>
            <div className='grid grid-cols-2 w-full items-center justify-center mt-8'>
                <div className='grid grid-cols-2 w-fit gap-2'>
                    <p>Initiator: </p>
                    <p className='underline'>
                        <Link to={getEtherscanAddressLink(votingItem.initiator)}
                              target='_blank'
                              className='w-fit'>
                            {shortenAddress(votingItem.initiator)}
                        </Link>
                    </p>
                    <p>Deposit: </p>
                    <p>{stringifyBigInt(votingItem.deposit)} TKN</p>
                    <p>Started at: </p>
                    <p className='underline'>{votingItem.startDate.toLocaleString()}</p>
                    <p>End at: </p>
                    <p className='underline'>{votingItem.endDate.toLocaleString()}</p>
                </div>
                <div className='grid grid-cols-2 gap-2 self-end'>
                    <Button variant='outline' disabled={isDisabled(votingItem)}
                            className='hover:bg-primary hover:text-accent' size='sm'>
                        Approve
                    </Button>
                    <Button variant='outline' disabled={isDisabled(votingItem)}
                            className='hover:bg-destructive hover:text-accent'
                            size='sm'>
                        Deny
                    </Button>
                </div>
            </div>
        </div>
    )
}
