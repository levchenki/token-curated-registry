import {ReactNode} from "react";
import {errorToast, toast} from "@/components/ui/use-toast.ts";
import {Button} from "@/components/ui/button.tsx";
import {IApplicationItem} from "@/types/interfaces.ts";
import {useApplicationStore} from "@/store/useApplicationStore.ts";
import {useVotingStore} from "@/store/useVotingStore.ts";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {stringifyBigInt} from "@/utils/helpers.ts";

interface IChallengeApplicationButtonProps {
    children: ReactNode
    address?: `0x${string}`
    application: IApplicationItem
}


export const ChallengeApplicationButton = ({
                                               children,
                                               address,
                                               application,
                                           }: IChallengeApplicationButtonProps) => {

    const {challengeApplication} = useApplicationStore(state => ({
        challengeApplication: state.challengeApplication
    }));

    const {addNewVoting} = useVotingStore(state => ({
        addNewVoting: state.addNewVoting
    }))

    const isDisabled = (v?: IApplicationItem) => {
        if (!v) {
            return true
        }
        return v.status !== 'OPEN' || !address;
    }


    const sendChallenge = () => {
        if (!address || !application) {
            return
        }
        // todo get deposit from initiator
        challengeApplication(application).then(() => {
            toast({
                title: 'Success',
                description: 'The challenge was successfully initialized',
            })
        }).then(() => addNewVoting(application, address, 'APPLICATION')).catch(() => {
            errorToast('An error occurred while initializing the challenge')
        })
    }


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='outline' disabled={isDisabled(application)}
                        size='sm'>
                    {children}
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
                    <AlertDialogAction onClick={sendChallenge}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}