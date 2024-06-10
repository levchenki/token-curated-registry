import {IApplicationItem} from "@/types/interfaces.ts";
import {Link} from "react-router-dom";
import {ExternalLink, Link as LinkIcon} from "lucide-react";
import {getEtherscanAddressLink, stringifyBigInt} from "@/utils/helpers.ts";
import {ChallengeApplicationButton} from "@/components/application/ChallengeApplicationButton.tsx";

interface IApplicationItemProps {
    application: IApplicationItem
    address?: `0x${string}`
}

export const ApplicationItem = ({application, address}: IApplicationItemProps) => {

    const getStatus = () => {
        if (application.status === 'OPEN') {
            return 'Open application';
        } else if (application.status === 'CHALLENGING') {
            return 'Challenging application';
        } else {
            return 'Closed application';
        }
    }

    const getStatusColor = () => {
        if (application.status === 'OPEN') {
            return 'text-primary';
        } else if (application.status === 'CHALLENGING') {
            return 'text-yellow-500';
        } else {
            return 'text-destructive';
        }
    }


    return (
        <div className='flex flex-col w-full h-fit items-center px-4 pb-5 py-2 justify-between rounded-md border'>
            <div className='flex flex-row justify-between w-full items-center mt-2 px-3 gap-10'>
                <div className='text-lg text-primary font-bold hover:underline underline-offset-4'>
                    <Link to={application.link} target='_blank'>
                        <div className='flex items-center gap-2 text-md'>
                            <p>{application.name}</p>
                            <LinkIcon className='w-4'/>
                        </div>
                    </Link>
                </div>
                <div className={`flex items-center gap-3 text-md ${getStatusColor()}`}>
                    {getStatus()}
                    <Link to={getEtherscanAddressLink(application.address)}
                          target='_blank'
                          className='w-fit'>
                        <ExternalLink size={16}
                                      className='justify-self-start hover:cursor-pointer'/>
                    </Link>
                </div>
            </div>
            <div className='flex mt-4 w-full text-gray-500'>
                <p className='justify-self-start'>
                    {application.description}
                </p>
            </div>
            <div className='grid grid-cols-2 w-full items-center justify-center mt-4'>
                <div className='grid grid-cols-2 w-fit gap-2'>
                    <p>Deposit: </p>
                    <p>{stringifyBigInt(application.deposit)} TKN</p>
                    <p>Started at: </p>
                    <p className='underline'>{application.endDate.toLocaleString()}</p>
                    <p>End at: </p>
                    <p className='underline'>{application.endDate.toLocaleString()}</p>
                </div>
                <div className='flex flex-col gap-2 self-end'>
                    <ChallengeApplicationButton address={address} application={application}/>
                </div>
            </div>
        </div>
    )
}