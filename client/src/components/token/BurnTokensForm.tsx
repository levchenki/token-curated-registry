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

const burnFormSchema = z.object({
    burnedValue: z.preprocess(n => Number(n), z.number().positive())
})

export const BurnTokensForm = () => {
    const {toast} = useToast()
    const {burn} = useTokenStore((state) => ({
        burn: state.burn,
    }))

    const burnForm = useForm<z.infer<typeof burnFormSchema>>({
        resolver: zodResolver(burnFormSchema),
        defaultValues: {
            burnedValue: 0,
        }
    })


    const onBurnFormSubmit = async (values: z.infer<typeof burnFormSchema>) => {
        console.log(values.burnedValue)
        const converted = BigInt(values.burnedValue * 1e18)
        await burn(converted)
        toast({
            title: 'Burned',
            description: 'Burned'
        })
    }


    return (
        <Form {...burnForm}>
            <form onSubmit={burnForm.handleSubmit(onBurnFormSubmit)}>
                <FormField
                    control={burnForm.control}
                    name='burnedValue'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>To burn tokens</FormLabel>
                            <div className='flex w-full max-w-sm items-center space-x-2'>
                                <FormControl>
                                    <Input placeholder="TKN" {...field} />
                                </FormControl>
                                <Button type="submit">Burn</Button>
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