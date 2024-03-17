import {useAccount} from "wagmi";

import {Button} from "@/components/ui/button.tsx";
import {web3Modal} from "@/components/wallet/Web3ModalProvider.tsx";

export const ConnectButton = () => {
    const {isConnected} = useAccount()

    return (
        <>
            <Button
                variant={isConnected ? 'default' : 'destructive'}
                onClick={() => web3Modal.open()}>
                {isConnected ? 'Connected' : 'Connect'}
            </Button>
        </>
    )
}
