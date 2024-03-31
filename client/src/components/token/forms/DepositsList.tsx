import {Separator} from "@/components/ui/separator.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {useEffect} from "react";
import {useTokenStore} from "@/store/useTokenStore.ts";
import {shortenAddress, stringifyBigInt} from "@/utils/helpers.ts";
import {Link} from "react-router-dom";
import {SEPOLIA_ETHERSCAN_URL} from "@/utils/constants.ts";
import {LoaderIcon, SquareArrowOutUpRight} from "lucide-react";

export const DepositsList = () => {
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
                        deposits.map((deposit) => (
                            <div key={deposit.transactionHash}>
                                <Separator className="my-2"/>
                                <div className='grid grid-cols-3 text-sm my-4 mx-2 items-center'
                                     style={{gridTemplateColumns: '1fr 1fr 0.5fr'}}>
                                    <Link to={`${SEPOLIA_ETHERSCAN_URL}address/${deposit.address}`}
                                          className='text-primary underline-offset-4 hover:underline'>
                                        {shortenAddress(deposit.sender)}
                                    </Link>
                                    <span className='justify-self-center'>
                                {stringifyBigInt(deposit.amount, true)} USDT
                            </span>
                                    <Link to={`${SEPOLIA_ETHERSCAN_URL}tx/${deposit.transactionHash}`}
                                          target='_blank'
                                          className='hover:text-primary justify-self-end'>
                                        <SquareArrowOutUpRight className='size-4'/>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : <div className='flex justify-center items-center'>
                        <span>No deposits</span>
                    </div>
                }
            </div>
        </ScrollArea>
    )
}
