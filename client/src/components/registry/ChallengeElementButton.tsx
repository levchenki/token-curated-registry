import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {IRegistryItem} from "@/types/interfaces.ts";
import {useVotingStore} from "@/store/useVotingStore.ts";
import {Input} from "@/components/ui/input.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {NumberToBigInt} from "@/utils/helpers.ts";
import {errorToast, toast} from "@/components/ui/use-toast.ts";
import {useTokenStore} from "@/store/useTokenStore.ts";
import {useRegistryStore} from "@/store/useRegistryStore.ts";

interface IChallengeElementButtonProps {
    address?: `0x${string}`
    registryItem: IRegistryItem
}

const challengeElementSchema = z.object({
    deposit: z.preprocess(n => Number(n), z.number().positive().max(999999999999999))
})

export const ChallengeElementButton = ({
                                           address,
                                           registryItem,
                                       }: IChallengeElementButtonProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const {balance, spend} = useTokenStore((state) => ({
        balance: state.balance,
        spend: state.spend
    }))

    const {challengeRegistryItem} = useRegistryStore(state => ({
        challengeRegistryItem: state.challengeRegistryItem
    }))


    const {addNewVoting} = useVotingStore(state => ({
        addNewVoting: state.addNewVoting
    }))

    const challengeElementForm = useForm<z.infer<typeof challengeElementSchema>>({
        resolver: zodResolver(challengeElementSchema),
        defaultValues: {
            deposit: 0,
        }
    })

    const isDisabled = (r: IRegistryItem) => {
        return r.status !== 'ACTIVE' || !address;
    }

    const resetForm = () => {
        challengeElementForm.reset({
            deposit: 0
        })
    }

    const onChallengeElementFormSubmit = async (values: z.infer<typeof challengeElementSchema>) => {
        if (!address) {
            return
        }

        const convertedDeposit = NumberToBigInt(values.deposit)
        if (balance && balance < convertedDeposit) {
            errorToast('Deposit can\'t be greater than your balance')
            return
        }

        spend(convertedDeposit)
            .then(() => challengeRegistryItem(registryItem))
            .then(() => addNewVoting(
                registryItem.address,
                registryItem.name,
                registryItem.link,
                convertedDeposit,
                address,
                'MEMBERSHIP'))
            .then(() => {
                toast({
                    title: 'Success',
                    description: 'The challenge was successfully initialized',
                })
            })
            .catch(() => errorToast('An error occurred while initializing the challenge'))
            .finally(() => {
                toast({
                    title: 'Success',
                    description: 'The challenge was successfully initialized',
                })
                resetForm()
                setIsOpen(false)
            })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant='outline'
                        disabled={isDisabled(registryItem)}
                        size='sm'
                        className={registryItem.status !== 'ACTIVE' ? 'text-yellow-500' : ''}
                >
                    {registryItem.status !== 'ACTIVE' ? 'Challenging' : 'Challenge'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. You need to deposit some TKN to initialize the challenge.
                    </DialogDescription>
                </DialogHeader>
                <Form {...challengeElementForm}>
                    <form onSubmit={challengeElementForm.handleSubmit(onChallengeElementFormSubmit)}>
                        <FormField
                            name='deposit'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel htmlFor='deposit'>Deposit</FormLabel>
                                    <FormControl>
                                        <Input {...field} id='deposit' placeholder='Deposit'/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        <DialogFooter>
                            <DialogFooter className='mt-5'>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary" onClick={resetForm}>
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button disabled={!address} type="submit">Challenge</Button>
                            </DialogFooter>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}