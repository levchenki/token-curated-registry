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

const mintFormSchema = z.object({
    mintedValue: z.preprocess(n => Number(n), z.number().positive().max(999999999999999))
})

interface MintTokensFormProps {
    disabled: boolean
}

export const InputMintForm = ({disabled}: MintTokensFormProps) => {
    const {toast} = useToast()
    const [mintReward, setMintReward] = useState<bigint>()
    const {mint, getMintReward, isMinting} = useTokenStore((state) => ({
        mint: state.mint,
        getMintReward: state.getMintReward,
        isMinting: state.isMinting,
    }))

    const mintForm = useForm<z.infer<typeof mintFormSchema>>({
        resolver: zodResolver(mintFormSchema),
        defaultValues: {
            mintedValue: 0,
        }
    })

    const onMintFormSubmit = async (values: z.infer<typeof mintFormSchema>) => {
        const converted = NumberToBigInt(values.mintedValue)
        await mint(converted)
            .then(() => {
                toast({
                    title: 'Minted',
                    description: 'Minted'
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
                mintForm.reset()
                setMintReward(undefined)
            })
    }

    const onMintValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        const maxValue = 999999999999999;
        const value = e.target.value
        if (!value) {
            setMintReward(undefined)
            return
        }

        if (!+value || +value <= 0) {
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

        const converted = NumberToBigInt(+value)
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
                                <Button disabled={disabled || isMinting} type="submit">
                                    {
                                        isMinting
                                            ? <LoaderIcon className="animate-spin"/>
                                            : 'Mint'
                                    }
                                </Button>
                            </div>
                            <FormDescription>
                                {
                                    mintReward
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