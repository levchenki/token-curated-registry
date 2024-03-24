import {ModeToggle} from "@/components/theme/ModeToggle.tsx";
import {ConnectButton} from "@/components/wallet/ConnectWalletButton.tsx";
import {TokenPanel} from "@/components/wallet/token/TokenPanel.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";

export const Header = () => {
    return (
        <header className='flex flex-row px-16 py-5 items-center justify-between'>
            <h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
                Token Curated Registry
            </h2>
            <div className='flex flex-row items-center gap-16'>
                <Link to='registry'><Button variant='link'>Registry</Button></Link>
                <Link to='voting'><Button variant='link'>Voting</Button></Link>
                <Link to='token'><Button variant='link'>Token</Button></Link>
            </div>
            <div className='flex items-center gap-5'>
                <TokenPanel/>
                <ConnectButton/>
                <ModeToggle/>
            </div>
        </header>
    )
}