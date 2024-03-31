import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {useEffect} from "react";
import {useTokenStore} from "@/store/useTokenStore.ts";
import {LoaderIcon} from "lucide-react";
import {DepositListItem} from "@/components/token/deposit-list/DepositListItem.tsx";

export const DepositList = () => {
    const {
        getDeposits,
        deposits,
        isFetchingDeposits,
        listenDeposits
    } = useTokenStore(state => ({
        getDeposits: state.getDeposits,
        deposits: state.deposits,
        isFetchingDeposits: state.isFetchingDeposits,
        listenDeposits: state.listenDeposits
    }))

    useEffect(() => {
        getDeposits().catch(console.error)
    }, [getDeposits]);

    useEffect(() => {
        listenDeposits().catch(console.error)
    }, [listenDeposits]);


    return isFetchingDeposits
        ? <div className='flex justify-center items-center h-64'>
            <LoaderIcon className="animate-spin"/>
        </div>
        : deposits && (
        <ScrollArea className="h-64 w-80 rounded-md border">
            <div className="p-4">
                <h4 className="mb-4 text-lg font-semibold leading-none">Deposits</h4>
                {
                    deposits.length ? (
                        deposits.map((deposit) => <DepositListItem key={deposit.transactionHash} deposit={deposit}/>)
                    ) : <div className='flex justify-center items-center'>
                        <span>No deposits</span>
                    </div>
                }
            </div>
        </ScrollArea>
    )
}
