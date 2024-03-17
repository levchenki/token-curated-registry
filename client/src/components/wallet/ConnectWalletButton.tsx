import {useAccount} from "wagmi";

import {Button} from "@/components/ui/button.tsx";
import {useWeb3Modal} from "@web3modal/wagmi/react";

export const ConnectButton = () => {
    const {isConnected} = useAccount()
    const {open} = useWeb3Modal()

    return (
        <>
            <Button
                variant={isConnected ? 'default' : 'destructive'}
                onClick={() => open()}>
                {isConnected ? 'Connected' : 'Connect'}
            </Button>
        </>
    )
}
