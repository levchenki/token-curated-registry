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

const mintFormSchema = z.object({
    mintedValue: z.preprocess(n => Number(n), z.number().positive())
})

export const MintTokensForm = () => {
    const {toast} = useToast()
    const {mint} = useTokenStore((state) => ({
        mint: state.mint,

    }))

    const mintForm = useForm<z.infer<typeof mintFormSchema>>({
        resolver: zodResolver(mintFormSchema),
        defaultValues: {
            mintedValue: 0,
        }
    })

    const onMintFormSubmit = async (values: z.infer<typeof mintFormSchema>) => {
        const converted = BigInt(values.mintedValue * 1e18)
        await mint(converted)
        toast({
            title: 'Minted',
            description: 'Minted'
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
                                    <Input placeholder="USDT" {...field} />
                                </FormControl>
                                <Button type="submit">Mint</Button>
                            </div>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

            </form>
        </Form>

    )
}