import {Separator} from '@/components/ui/separator.tsx';
import {Input} from '@/components/ui/input.tsx';
import {Button} from '@/components/ui/button.tsx';
import {Link} from 'react-router-dom';
import {SEPOLIA_ETHERSCAN_URL} from '@/utils/constants.ts';
import {useAccount} from 'wagmi';
import {stringifyBigInt} from '@/utils/helpers.ts';

import {useReadAbcTokenBalanceOf} from '@/types/contracts.ts';
import {useToast} from '@/components/ui/use-toast';
import {useTokenStore} from "@/store/useTokenStore.ts";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";

const mintFormSchema = z.object({
    mintedValue: z.preprocess(n => parseFloat(z.string().parse(n)),
        z.number().positive())
})

const burnFormSchema = z.object({
    burnedValue: z.preprocess(n => parseFloat(z.string().parse(n)),
        z.number().positive())
})

export const TokenPage = () => {
    const {toast} = useToast()
    const {address} = useAccount()

    const {mint, burn} = useTokenStore((state) => ({
        mint: state.mint,
        burn: state.burn,
    }))

    const {data: balance, isLoading} = useReadAbcTokenBalanceOf({
        args: [address!],
        account: address!,
        query: {
            enabled: !!address,
        },
    });

    const mintForm = useForm<z.infer<typeof mintFormSchema>>({
        resolver: zodResolver(mintFormSchema),
        defaultValues: {
            mintedValue: 0,
        }
    })

    const burnForm = useForm<z.infer<typeof burnFormSchema>>({
        resolver: zodResolver(burnFormSchema),
        defaultValues: {
            burnedValue: 0,
        }
    })

    const onMintFormSubmit = async (values: z.infer<typeof mintFormSchema>) => {
        const converted = BigInt(values.mintedValue * 1e18)
        console.log(converted)
        await mint(converted)
        toast({
            title: 'Minted',
            description: 'Minted'
        })
    }

    const onBurnFormSubmit = async (values: z.infer<typeof burnFormSchema>) => {
        const converted = BigInt(values.burnedValue * 1e18)
        console.log(converted)
        await burn(converted)
        toast({
            title: 'Burned',
            description: 'Burned'
        })
    }

    const tokenContractAddress = SEPOLIA_ETHERSCAN_URL + 'address/0x1234567890123456789012345678901234567890'
    return (
        <>
            <h3 className='text-2xl font-bold'>
                <Link className='hover:text-primary hover:underline'
                      to={tokenContractAddress}>
                    Token info
                </Link>
            </h3>
            <Separator className='w-80'/>
            <h2 className='text-xl font-semibold'>
                <span>
                    Balance:&nbsp;
                </span>
                <span className='underline'>
                        {
                            isLoading && !balance ? '...' : (stringifyBigInt(balance) + ' TKN')
                        }
                 </span>
            </h2>

            <div className='flex flex-col rounded-md border-2 px-10 py-5 gap-5'>
                <Form {...mintForm}>
                    <form className='flex w-full max-w-sm items-center space-x-2'
                          onSubmit={mintForm.handleSubmit(onMintFormSubmit)}>
                        <FormField
                            control={mintForm.control}
                            name='mintedValue'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>To mint tokens</FormLabel>
                                    <FormControl>
                                        <Input placeholder="USDT" {...field} />
                                    </FormControl>
                                    <FormDescription>

                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Mint</Button>
                    </form>
                </Form>

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
            </div>
        </>
    );
}