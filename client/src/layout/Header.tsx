import {ModeToggle} from "@/components/theme/ModeToggle.tsx";
import {ConnectButton} from "@/components/wallet/ConnectWalletButton.tsx";

export const Header = () => {
    return (
        <header className='flex flex-row px-10 py-5 items-center justify-between'>
            <h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
                Token Curated Registry
            </h2>
            <div className='flex items-center gap-5'>
                <ConnectButton/>
                <ModeToggle/>
            </div>
        </header>
    )
}