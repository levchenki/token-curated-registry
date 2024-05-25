import {Button} from "@/components/ui/button.tsx";
import {Eye} from "lucide-react";

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip.tsx"
import {useTokenStore} from "@/store/useTokenStore.ts";
import {stringifyBigInt} from "@/utils/helpers.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {useAccount} from "wagmi";
import {useEffect} from "react";
import {errorToast} from "@/components/ui/use-toast.ts";


export const ShowTokenButton = () => {
    const {address} = useAccount()
    const {
        balance,
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
            errorToast(e.message)
        })
    }, [address, getBalance])

    useEffect(() => {
        if (!address) {
            return
        }
        listenBalance(address)
            .catch(e => errorToast(e.message))
    }, [address, listenBalance])


    return (
        <>
            {
                address && (
                    <Badge variant='outline'>
                        {stringifyBigInt(balance)} TKN
                    </Badge>
                )
            }
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant='outline'>
                            <Eye size='22'/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Add token to the wallet</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </>
    )
}

