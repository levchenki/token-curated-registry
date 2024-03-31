import {LoaderIcon} from "lucide-react";
import {stringifyBigInt} from "@/utils/helpers.ts";
import {useTokenStore} from "@/store/useTokenStore.ts";
import {useEffect} from "react";
import {useToast} from "@/components/ui/use-toast.ts";


interface TokenBalanceProps {
    address: `0x${string}` | undefined;
}

export const TokenBalanceTitle = ({address,}: TokenBalanceProps) => {
    const {toast} = useToast()
    const {
        balance,
        isFetchingBalance,
        getBalance,
        listenBalance,
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

    return (
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
    )
}