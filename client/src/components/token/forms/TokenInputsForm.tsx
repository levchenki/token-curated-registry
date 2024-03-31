import {MintTokensForm} from "@/components/token/forms/MintTokensForm.tsx";
import {BurnTokensForm} from "@/components/token/forms/BurnTokensForm.tsx";
import {useTokenStore} from "@/store/useTokenStore.ts";
import {DepositTokensForm} from "@/components/token/forms/DepositTokensForm.tsx";
import {useEffect, useState} from "react";
import {LoaderIcon} from "lucide-react";
import {DepositsList} from "@/components/token/forms/DepositsList.tsx";


interface TokenInputsFormProps {
    address: `0x${string}` | undefined
}

export const TokenInputsForm = ({address}: TokenInputsFormProps) => {
    const [isActive, setIsActive] = useState<boolean>()
    const [isOwner, setIsOwner] = useState<boolean>()
    const {getIsActivePeriod, getIsOwner} = useTokenStore(state => ({
        getIsActivePeriod: state.getIsActivePeriod,
        getIsOwner: state.getIsOwner
    }))

    useEffect(() => {
        getIsActivePeriod().then((res) => {
            setIsActive(res)
        })
    }, [getIsActivePeriod]);

    useEffect(() => {
        getIsOwner(address).then((res) => {
            setIsOwner(res)
        })
    }, [address, getIsOwner]);

    return (
        <>
            <div className='flex flex-col rounded-md border-2 px-10 py-5 gap-5'>

                {
                    isActive === undefined ? <div>
                            <LoaderIcon className="animate-spin"/>
                        </div> :
                        isActive ?
                            <>
                                <MintTokensForm disabled={!address}/>
                                <BurnTokensForm disabled={!address}/>
                            </>

                            : <>
                                <DepositTokensForm address={address} isDistributable={isOwner && !isActive}/>
                            </>
                }
            </div>
            {
                !isActive && <DepositsList/>
            }
        </>
    )
}