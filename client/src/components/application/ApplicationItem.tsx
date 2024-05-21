import {IApplicationItem} from "@/types/interfaces.ts";
import {Link} from "react-router-dom";
import {ExternalLink, Link as LinkIcon} from "lucide-react";
import {getEtherscanAddressLink, stringifyBigInt} from "@/utils/helpers.ts";
import {Button} from "@/components/ui/button.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface IApplicationItemProps {
    application: IApplicationItem
}

export const ApplicationItem = ({application}: IApplicationItemProps) => {
    const getStatus = () => {
        if (application.status === 'OPEN') {
            return 'Open application';
        } else {
            return 'Closed application';
        }
    }

    const getStatusColor = () => {
        if (application.status === 'OPEN') {
            return 'text-yellow-500';
        } else {
            return 'text-destructive';
        }
    }

    const isDisabled = (v: IApplicationItem) => {
        return v.status !== 'OPEN';
    }

    return (
        <div className='flex flex-col w-full h-fit items-center px-4 pb-5 py-2 justify-between rounded-md border'>
            <div className='flex flex-row justify-between w-full items-center mt-2 px-3'>
                <div className='text-lg text-primary font-bold hover:underline underline-offset-4'>
                    <Link to={application.link} target='_blank'>
                        <div className='flex items-center gap-3 text-md'>
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
            <div className='grid grid-cols-2 w-full items-center justify-center mt-8'>
                <div className='grid grid-cols-2 gap-2'>

                    <p>Deposit: </p>
                    <p>{stringifyBigInt(application.deposit)} TKN</p>
                    <p>Started at: </p>
                    <p className='underline'>{application.startDate.toLocaleDateString()}</p>
                    <p>End at: </p>
                    <p className='underline'>{application.endDate.toLocaleDateString()}</p>
                </div>
                <div className='flex flex-col gap-2 self-end'>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant='outline' disabled={isDisabled(application)}
                                    size='sm'>
                                Challenge
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. You will
                                    spend {stringifyBigInt(application.deposit)} TKN to initialize the challenge.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
            </div>
        </div>
    )
}