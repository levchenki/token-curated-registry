import {TokenButton} from "@/components/wallet/token/TokenButton.tsx";
import {useAccount} from "wagmi";
import {TokenInfoModal} from "@/components/wallet/token/TokenInfoModal.tsx";


export const TokenPanel = () => {
    const {isConnected} = useAccount()

    return (
        <>
            {
                <TokenInfoModal disabled={!isConnected}/>
            }
            <TokenButton/>

        </>
    )
}

