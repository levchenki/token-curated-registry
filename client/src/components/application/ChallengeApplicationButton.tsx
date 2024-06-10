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
import {useTokenStore} from "@/store/useTokenStore.ts";

interface IChallengeApplicationButtonProps {
    address?: `0x${string}`
    application: IApplicationItem
}


export const ChallengeApplicationButton = ({
                                               address,
                                               application,
                                           }: IChallengeApplicationButtonProps) => {

    const {balance, spend} = useTokenStore((state) => ({
        balance: state.balance,
        spend: state.spend
    }))


    const {challengeApplication} = useApplicationStore(state => ({
        challengeApplication: state.challengeApplication
    }));

    const {addNewVoting} = useVotingStore(state => ({
        addNewVoting: state.addNewVoting
    }))

    const isDisabled = (a: IApplicationItem) => {
        return a.status !== 'OPEN' || !address;
    }


    const sendChallenge = () => {
        if (!address) {
            return
        }

        if (balance && application.deposit > balance) {
            errorToast('Not enough balance')
            return
        }

        spend(application.deposit)
            .then(() => challengeApplication(application))
            .then(() => addNewVoting(application.address,
                application.name,
                application.link,
                application.deposit,
                address,
                'APPLICATION'))
            .then(() => {
                toast({
                    title: 'Success',
                    description: 'The challenge was successfully initialized',
                })
            })
            .catch(() => {
                errorToast('An error occurred while initializing the challenge')
            })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='outline' disabled={isDisabled(application)}
                        size='sm'
                        className={application.status === 'CHALLENGING' ? 'text-yellow-500' : ''}
                >
                    {application.status === 'CHALLENGING'
                        ? 'Challenging'
                        : application.status === 'OPEN' ? 'Challenge' : 'Challenged'}
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