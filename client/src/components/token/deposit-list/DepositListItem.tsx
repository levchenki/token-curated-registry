import {Separator} from "@/components/ui/separator.tsx";
import {shortenAddress, stringifyBigInt} from "@/utils/helpers.ts";
import {Link} from "react-router-dom";
import {SEPOLIA_ETHERSCAN_URL} from "@/utils/constants.ts";
import {SquareArrowOutUpRight} from "lucide-react";
import {DepositEvent} from "@/types/interfaces.ts";

interface DepositsListItemProps {
    deposit: DepositEvent
}

export const DepositListItem = ({deposit}: DepositsListItemProps) => {

    return (
        <>
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
        </>
    )
}
