import {Separator} from '@/components/ui/separator.tsx';
import {Link} from 'react-router-dom';
import {SEPOLIA_ETHERSCAN_URL, TOKEN_CONTRACT_ADDRESS} from '@/utils/constants.ts';
import {useAccount} from 'wagmi';


import {TokenForm} from "@/components/token/forms/TokenForm.tsx";
import {TokenBalanceTitle} from "@/components/token/TokenBalanceTitle.tsx";


export const TokenPage = () => {
    const {address} = useAccount()

    const tokenContractAddress = SEPOLIA_ETHERSCAN_URL + `address/${TOKEN_CONTRACT_ADDRESS}`
    return (
        <>
            <h3 className='text-2xl font-bold'>
                <Link className='hover:text-primary hover:underline'
                      to={tokenContractAddress}>
                    Token info
                </Link>
            </h3>
            <Separator className='w-80'/>
            <TokenBalanceTitle address={address}/>
            <TokenForm address={address}/>
        </>
    );
}