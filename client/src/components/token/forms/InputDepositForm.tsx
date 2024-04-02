import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useTokenStore} from "@/store/useTokenStore.ts";
import {useToast} from "@/components/ui/use-toast.ts";
import {NumberToBigInt, stringifyBigInt} from "@/utils/helpers.ts";

const depositFormSchema = z.object({
    depositedValue: z.preprocess(n => Number(n), z.number().positive().max(999999999999999))
})

interface DepositTokensFormProps {
    address: `0x${string}` | undefined
    isDistributable?: boolean
}

export const InputDepositForm = ({address, isDistributable}: DepositTokensFormProps) => {
    const {toast} = useToast()
    const {deposit, distribute} = useTokenStore((state) => ({
        deposit: state.deposit,
        distribute: state.distribute,
    }))

    const depositForm = useForm<z.infer<typeof depositFormSchema>>({
        resolver: zodResolver(depositFormSchema),
        defaultValues: {
            depositedValue: 0,
        }
    })

    const onDepositFormSubmit = async (values: z.infer<typeof depositFormSchema>) => {
        const converted = NumberToBigInt(values.depositedValue)
        await deposit(converted)
            .then(() => {
                toast({
                    title: 'Deposited',
                    description: `Deposited ${stringifyBigInt(converted)} USDT`,
                })
            })
            .catch(e => {
                toast({
                    title: 'Error',
                    variant: 'destructive',
                    description: e.message
                })
            })
    }

    const onDistributeButtonClick = async () => {
        await distribute(address, isDistributable)
            .then(() => {
                toast({
                    title: 'Distributed',
                    description: 'Distributed'
                })
            })
            .catch(e => {
                toast({
                    title: 'Error',
                    variant: 'destructive',
                    description: e.message
                })
            })
    }

    return (
        <div>
            <Form {...depositForm}>
                <form className='flex w-full max-w-sm items-center space-x-2'
                      onSubmit={depositForm.handleSubmit(onDepositFormSubmit)}>
                    <FormField
                        control={depositForm.control}
                        name='depositedValue'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>To deposit tokens</FormLabel>
                                <div className='flex w-full max-w-sm items-center space-x-2'>
                                    <FormControl>
                                        <Input placeholder="USDT"
                                               {...field}
                                               onChange={(e) => {
                                                   field.onChange(e)
                                                   depositForm.clearErrors('depositedValue')
                                               }}
                                        />
                                    </FormControl>
                                    <Button disabled={!address} type="submit">
                                        Deposit
                                    </Button>
                                </div>
                                <FormDescription>
                                    You will receive your deposit in tokens after the start of the active period
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            {
                isDistributable && <>
                    <div className='flex justify-end'
                         onClick={onDistributeButtonClick}
                    >
                        <Button variant='secondary'>
                            DistributeTokens
                        </Button>
                    </div>
                </>
            }
        </div>


    )
}