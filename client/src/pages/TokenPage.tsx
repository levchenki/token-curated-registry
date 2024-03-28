import {Separator} from '@/components/ui/separator.tsx';
import {Link} from 'react-router-dom';
import {SEPOLIA_ETHERSCAN_URL} from '@/utils/constants.ts';
import {useAccount} from 'wagmi';
import {stringifyBigInt} from '@/utils/helpers.ts';

import {abcTokenAddress, useReadAbcTokenBalanceOf} from '@/types/contracts.ts';
import {TokenInputsForm} from "@/components/token/TokenInputsForm.tsx";


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
                        !address
                            ? 'You need to connect your wallet'
                            : (isFetching && !balance ? '...' : (stringifyBigInt(balance) + ' TKN'))

                    }
                 </span>
            </h2>
            <TokenInputsForm address={address}/>
        </>
    );
}