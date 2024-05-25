import {Button} from "@/components/ui/button.tsx";
import {LoaderIcon, UserRoundPlus} from "lucide-react";
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
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useAccount} from "wagmi";
import {errorToast, toast} from "@/components/ui/use-toast.ts";
import {useTokenStore} from "@/store/useTokenStore.ts";
import {isValidURL, NumberToBigInt} from "@/utils/helpers.ts";
import {useVotingStore} from "@/store/useVotingStore.ts";
import {useState} from "react";
import {useApplicationStore} from "@/store/useApplicationStore.ts";

const addItemFormSchema = z.object({
    address: z.string().optional(),
    name: z.string().min(1),
    link: z.string().min(1),
    deposit: z.preprocess(n => Number(n), z.number().positive())
})

export const AddApplicationDialog = () => {
    const [isOpen, setIsOpen] = useState(false)
    const {address} = useAccount()
    const {balance} = useTokenStore((state) => ({
        balance: state.balance
    }))

    const {votingList} = useVotingStore(state => ({
        votingList: state.votingList
    }))

    const {addNewApplication, applicationList} = useApplicationStore(state => ({
        addNewApplication: state.addNewApplication,
        applicationList: state.applications
    }))

    const addItemForm = useForm<z.infer<typeof addItemFormSchema>>({
        resolver: zodResolver(addItemFormSchema),
        defaultValues: {
            address: address,
            name: '',
            link: '',
            deposit: 0
        }
    })

    const onAddItemFormSubmit = async (values: z.infer<typeof addItemFormSchema>) => {
        if (!address) {
            return
        }

        values.address = address

        if (isDuplicatedAddress(address)) {
            errorToast('You\'re already have an application or item in this registry')
            return
        }


        if (!isValidURL(values.link)) {
            errorToast('Link is not valid')
            return
        }


        if (!isValid()) {
            errorToast('Inputs are not valid')
            return
        }

        const convertedDeposit = NumberToBigInt(values.deposit)
        if (balance && balance < convertedDeposit) {
            errorToast('Deposit can\'t be greater than your balance')
            return
        }


        addNewApplication(address, values.name, values.link, convertedDeposit).then(() => {
            toast({
                title: 'Success',
                description: `Application sent from address ${address} for ${values.name} with deposit ${values.deposit} TKN`
            })
        }).catch(() => {
            errorToast('An error occurred while sending the application')
        }).finally(() => {
            resetForm()
            setIsOpen(false)
        })
    }

    const isDuplicatedAddress = (address: string) => {
        const isInVotingList = votingList.find((v) => {
            return v.address === address && v.status === 'ACTIVE'
        })
        const isInApplicationList = applicationList.find((a) => {
            return a.address === address && a.status === 'OPEN'
        })

        return isInVotingList || isInApplicationList
    }

    const isValid = () => {
        const {name, link, deposit} = addItemForm.getValues();
        return name.length > 0 && link.length > 0 && deposit > 0
    }

    const resetForm = () => {
        addItemForm.reset({
            name: '',
            link: '',
            deposit: 0
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button disabled={!address}>
                    <UserRoundPlus/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New application for registry</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <Form {...addItemForm}>
                    <form className='w-full max-w-sm items-center'
                          onSubmit={addItemForm.handleSubmit(onAddItemFormSubmit)}>
                        {
                            address ? <div>
                                    <FormField
                                        control={addItemForm.control}
                                        name='address'
                                        disabled
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Address"
                                                           {...field}
                                                           value={address}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={addItemForm.control}
                                        name='name'
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Name of the app</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Name"
                                                           {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={addItemForm.control}
                                        name='link'
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Github link</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Link"
                                                           {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={addItemForm.control}
                                        name='deposit'
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Deposit</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Deposit"
                                                           {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                : <div className='flex w-full justify-center'>
                                    <LoaderIcon className='animate-spin'/>
                                </div>
                        }

                        <DialogFooter className='mt-5'>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary" onClick={resetForm}>
                                    Close
                                </Button>
                            </DialogClose>
                            <Button disabled={!address} type="submit">Send a new application</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}