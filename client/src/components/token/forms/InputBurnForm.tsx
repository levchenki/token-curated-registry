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
import {ChangeEvent, useState} from "react";
import {NumberToBigInt, stringifyBigInt} from "@/utils/helpers.ts";
import {LoaderIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";

const burnFormSchema = z.object({
    burnedValue: z.preprocess(n => Number(n), z.number().positive().max(999999999999999))
})

interface BurnTokensFormProps {
    disabled: boolean
}

export const InputBurnForm = ({disabled}: BurnTokensFormProps) => {
    const {toast} = useToast()
    const [burnRefund, setBurnRefund] = useState<bigint>()
    const {burn, getBurnRefund, isBurning, balance} = useTokenStore((state) => ({
        burn: state.burn,
        getBurnRefund: state.getBurnRefund,
        isBurning: state.isBurning,
        balance: state.balance
    }))

    const burnForm = useForm<z.infer<typeof burnFormSchema>>({
        resolver: zodResolver(burnFormSchema),
        defaultValues: {
            burnedValue: 0,
        }
    })

    const onBurnFormSubmit = async (values: z.infer<typeof burnFormSchema>) => {
        const converted = NumberToBigInt(values.burnedValue)

        if (balance && converted > balance) {
            toast({
                title: 'Error',
                variant: 'destructive',
                description: 'Not enough balance'
            })
            return
        }

        await burn(converted)
            .then(() => {
                toast({
                    title: 'Burned',
                    description: 'Burned'
                })
            })
            .catch(e => {
                toast({
                    title: 'Error',
                    variant: 'destructive',
                    description: e.message
                })
            })
            .finally(() => {
                burnForm.reset()
                setBurnRefund(undefined)
            })
    }

    const onBurnValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        const maxValue = 999999999999999;
        const value = e.target.value
        burnForm.clearErrors('burnedValue')
        if (!value) {
            setBurnRefund(undefined)
            return
        }

        if (!+value || +value <= 0) {
            setBurnRefund(undefined)
            return
        }

        if (+value > maxValue) {
            burnForm.setError('burnedValue', {
                type: 'max',
                message: 'Value must be less than 999999999999999'
            })
            return
        }

        const converted = NumberToBigInt(+value)
        if (balance && converted > balance) {
            burnForm.setError('burnedValue', {
                type: 'max',
                message: 'Value must be less than balance'
            })
            return
        }

        getBurnRefund(converted).then((r) => {
            setBurnRefund(r)
        })
    }

    return (
        <Form {...burnForm}>
            <form className='flex w-full max-w-sm items-center space-x-2'
                  onSubmit={burnForm.handleSubmit(onBurnFormSubmit)}>
                <FormField
                    control={burnForm.control}
                    name='burnedValue'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className='flex gap-2 items-center'>
                                To burn tokens
                                <Badge variant='outline'>
                                    TKN to USDT
                                </Badge>
                            </FormLabel>
                            <div className='flex w-full max-w-sm items-center space-x-2'>
                                <FormControl>
                                    <Input placeholder="TKN"
                                           {...field}
                                           onChange={(e) => {
                                               field.onChange(e)
                                               onBurnValueChange(e)
                                           }}
                                    />
                                </FormControl>
                                <Button disabled={disabled || isBurning} type="submit">
                                    {
                                        isBurning
                                            ? <LoaderIcon className="animate-spin"/>
                                            : 'Burn'
                                    }
                                </Button>
                            </div>
                            <FormDescription>
                                {
                                    burnRefund
                                        ? `You will gain ${stringifyBigInt(burnRefund)} USDT`
                                        : ''
                                }
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}