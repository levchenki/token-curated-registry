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

const mintFormSchema = z.object({
    mintedValue: z.preprocess(n => Number(n), z.number().positive().max(999999999999999))
})

interface MintTokensFormProps {
    disabled: boolean
}

export const MintTokensForm = ({disabled}: MintTokensFormProps) => {
    const {toast} = useToast()
    const [mintReward, setMintReward] = useState<bigint>()
    const {mint, getMintReward} = useTokenStore((state) => ({
        mint: state.mint,
        getMintReward: state.getMintReward,
    }))

    const mintForm = useForm<z.infer<typeof mintFormSchema>>({
        resolver: zodResolver(mintFormSchema),
        defaultValues: {
            mintedValue: 0,
        }
    })

    const onMintFormSubmit = async (values: z.infer<typeof mintFormSchema>) => {
        const converted = BigInt(values.mintedValue) * BigInt(1e18)
        await mint(converted)
        toast({
            title: 'Minted',
            description: 'Minted'
        })
    }

    const onMintValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        const maxValue = 999999999999999;
        const value = e.target.value
        if (!value) {
            setMintReward(undefined)
            mintForm.reset()
            return

        }

        if (!+value) {
            setMintReward(undefined)
            return

        }

        if (+value > maxValue) {
            mintForm.setError('mintedValue', {
                type: 'max',
                message: 'Value must be less than 999999999999999'
            })
            return
        }

        const converted = BigInt(+value) * BigInt(1e18)
        getMintReward(converted).then((r) => {
            setMintReward(r)
        })
    }

    return (
        <Form {...mintForm}>
            <form className='flex w-full max-w-sm items-center space-x-2'
                  onSubmit={mintForm.handleSubmit(onMintFormSubmit)}>
                <FormField
                    control={mintForm.control}
                    name='mintedValue'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>To mint tokens</FormLabel>
                            <div className='flex w-full max-w-sm items-center space-x-2'>
                                <FormControl>
                                    <Input placeholder="USDT"
                                           {...field}
                                           onChange={(e) => {
                                               field.onChange(e)
                                               onMintValueChange(e)
                                           }}
                                    />
                                </FormControl>
                                <Button disabled={disabled} type="submit">Mint</Button>
                            </div>
                            <FormDescription>
                                {
                                    field.value && !mintForm.formState.errors.mintedValue
                                        ? `You will gain ${stringifyBigInt(mintReward)} tokens`
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