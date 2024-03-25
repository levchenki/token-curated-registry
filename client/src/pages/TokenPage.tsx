import {Separator} from '@/components/ui/separator.tsx';
import {Input} from '@/components/ui/input.tsx';
import {Button} from '@/components/ui/button.tsx';
import {Link} from 'react-router-dom';
import {SEPOLIA_ETHERSCAN_URL} from '@/utils/constants.ts';
import {useAccount} from 'wagmi';
import {stringifyBigInt} from '@/utils/helpers.ts';

import {useReadAbcTokenBalanceOf} from '@/types/contracts.ts';
import {useToast} from '@/components/ui/use-toast';


export const TokenPage = () => {
    const {toast} = useToast()
    const {address} = useAccount()
    const {data: balance, isLoading} = useReadAbcTokenBalanceOf({
        args: [address!],
        account: address!,
        query: {
            enabled: !!address,
        },
    });


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
                <div className='flex w-full max-w-sm items-center space-x-2'>
                    <Input type='number' placeholder='USDT'/>
                    <Button onClick={() => toast({
                        title: 'Minted',
                        description: 'Minted'
                    })}>
                        Mint
                    </Button>
                </div>
                <div className='flex w-full max-w-sm items-center space-x-2'>
                    <Input type='number' placeholder='TKN'/>
                    <Button onClick={() => toast({
                        title: 'Burned',
                        description: 'Burned',
                        variant: 'destructive',
                    })}>
                        Burn
                    </Button>
                </div>
            </div>
        </>
    );
}