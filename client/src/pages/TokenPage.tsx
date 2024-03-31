import {Separator} from '@/components/ui/separator.tsx';
import {Link} from 'react-router-dom';
import {SEPOLIA_ETHERSCAN_URL, TOKEN_CONTRACT_ADDRESS} from '@/utils/constants.ts';
import {useAccount} from 'wagmi';
import {stringifyBigInt} from '@/utils/helpers.ts';


import {TokenInputsForm} from "@/components/token/forms/TokenInputsForm.tsx";
import {useTokenStore} from "@/store/useTokenStore.ts";
import {useEffect} from "react";
import {useToast} from "@/components/ui/use-toast.ts";
import {LoaderIcon} from "lucide-react";


export const TokenPage = () => {
    const {toast} = useToast()
    const {address} = useAccount()
    const {
        balance,
        isFetchingBalance,
        getBalance,
        listenBalance
    } = useTokenStore(state => ({
        balance: state.balance,
        isFetchingBalance: state.isFetchingBalance,
        getBalance: state.getBalance,
        listenBalance: state.listenBalance,
    }))


    useEffect(() => {
        getBalance(address).catch(e => {
            toast({
                title: 'Error',
                description: e.message,
            })
            console.log(e)
        })
    }, [toast, address, getBalance])


    useEffect(() => {
        if (!address) {
            return
        }
        listenBalance(address)
            .catch(e => {
                toast({
                    title: 'Error',
                    description: e.message,
                })
            })
    }, [toast, address, listenBalance])

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
            <h2 className='text-xl font-semibold'>
                {
                    !address
                        ? 'You need to connect your wallet to see the balance'
                        : <>
                            <div className='flex flex-row items-center'>
                                Balance:&nbsp;
                                <span className='underline'>
                                {
                                    isFetchingBalance || balance === undefined
                                        ? <LoaderIcon className="animate-spin"/>
                                        : (stringifyBigInt(balance) + ' TKN')
                                }
                                </span>
                            </div>
                        </>
                }
            </h2>
            <TokenInputsForm address={address}/>
        </>
    );
}