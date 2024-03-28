import {Separator} from '@/components/ui/separator.tsx';
import {Link} from 'react-router-dom';
import {SEPOLIA_ETHERSCAN_URL} from '@/utils/constants.ts';
import {useAccount} from 'wagmi';
import {stringifyBigInt} from '@/utils/helpers.ts';

import {abcTokenAddress, useReadAbcTokenBalanceOf} from '@/types/contracts.ts';
import {MintTokensForm} from "@/components/token/MintTokensForm.tsx";
import {BurnTokensForm} from "@/components/token/BurnTokensForm.tsx";


export const TokenPage = () => {
    const {address} = useAccount()

    const {data: balance, isFetching} = useReadAbcTokenBalanceOf({
        args: [address!],
        account: address!,
        query: {
            enabled: !!address,
        },
    });


    const tokenContractAddress = SEPOLIA_ETHERSCAN_URL + `address/${abcTokenAddress}`
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
                            isFetching && !balance ? '...' : (stringifyBigInt(balance) + ' TKN')
                        }
                 </span>
            </h2>

            <div className='flex flex-col rounded-md border-2 px-10 py-5 gap-5'>
                <MintTokensForm/>
                <BurnTokensForm/>
            </div>
        </>
    );
}