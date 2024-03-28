import {MintTokensForm} from "@/components/token/MintTokensForm.tsx";
import {BurnTokensForm} from "@/components/token/BurnTokensForm.tsx";


interface TokenFormProps {
    address: `0x${string}` | undefined
}

export const TokenInputsForm = ({address}: TokenFormProps) => {
    return (
        <div className='flex flex-col rounded-md border-2 px-10 py-5 gap-5'>
            <MintTokensForm disabled={!address}/>
            <BurnTokensForm disabled={!address}/>
        </div>
    )
}