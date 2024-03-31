import {InputMintForm} from "@/components/token/forms/InputMintForm.tsx";
import {InputBurnForm} from "@/components/token/forms/InputBurnForm.tsx";
import {useTokenStore} from "@/store/useTokenStore.ts";
import {useEffect, useState} from "react";
import {LoaderIcon} from "lucide-react";
import {DepositList} from "@/components/token/deposit-list/DepositList.tsx";
import {InputDepositForm} from "@/components/token/forms/InputDepositForm.tsx";


interface TokenInputsFormProps {
    address: `0x${string}` | undefined
}

export const TokenForm = ({address}: TokenInputsFormProps) => {
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
                                <InputMintForm disabled={!address}/>
                                <InputBurnForm disabled={!address}/>
                            </>

                            : <>
                                <InputDepositForm address={address} isDistributable={isOwner && !isActive}/>
                            </>
                }
            </div>
            {
                !isActive && <DepositList/>
            }
        </>
    )
}