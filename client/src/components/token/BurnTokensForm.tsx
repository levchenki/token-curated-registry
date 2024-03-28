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
import {stringifyBigInt} from "@/utils/helpers.ts";

const burnFormSchema = z.object({
    burnedValue: z.preprocess(n => Number(n), z.number().positive().max(999999999999999))
})

interface BurnTokensFormProps {
    disabled: boolean
}

export const BurnTokensForm = ({disabled}: BurnTokensFormProps) => {
    const {toast} = useToast()
    const [burnReward, setBurnReward] = useState<bigint>()
    const {burn, getBurnRefund} = useTokenStore((state) => ({
        burn: state.burn,
        getBurnRefund: state.getBurnRefund,
    }))

    const burnForm = useForm<z.infer<typeof burnFormSchema>>({
        resolver: zodResolver(burnFormSchema),
        defaultValues: {
            burnedValue: 0,
        }
    })

    const onBurnFormSubmit = async (values: z.infer<typeof burnFormSchema>) => {
        const converted = BigInt(values.burnedValue * 1e18)
        await burn(converted)
        toast({
            title: 'Burned',
            description: 'Burned'
        })
    }

    const onBurnValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (!value) {
            setBurnReward(undefined)
            burnForm.reset()
            return
        }

        if (!+value) {
            setBurnReward(undefined)
            return
        }

        const converted = BigInt(+value * 1e18)
        getBurnRefund(converted).then((r) => {
            setBurnReward(r)
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
                            <FormLabel>To burn tokens</FormLabel>
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
                                <Button disabled={disabled} type="submit">Burn</Button>
                            </div>
                            <FormDescription>
                                {
                                    field.value && !burnForm.formState.errors.burnedValue
                                        ? `You will gain ${stringifyBigInt(burnReward)} USDT`
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