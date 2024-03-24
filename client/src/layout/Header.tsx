import {ModeToggle} from "@/components/theme/ModeToggle.tsx";
import {ConnectButton} from "@/components/wallet/ConnectWalletButton.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import {ShowTokenButton} from "@/components/wallet/ShowTokenButton.tsx";

export const Header = () => {
    return (
        <header className='grid grid-cols-1 px-16 py-5 mb-20 md:grid-cols-3'>
            <h2 className='md:text-start text-center scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0'>
                Token Curated Registry
            </h2>
            <div className='flex flex-row items-center gap-10 justify-center'>
                <Link to='registry'>
                    <Button className='font-semibold' variant='link'>
                        Registry
                    </Button>
                </Link>
                <Link to='voting'>
                    <Button className='font-semibold' variant='link'>
                        Voting
                    </Button>
                </Link>
                <Link to='token'>
                    <Button className='font-semibold' variant='link'>
                        Token
                    </Button>
                </Link>
            </div>
            <div className='flex md:justify-end justify-center gap-5'>
                <ShowTokenButton/>
                <ConnectButton/>
                <ModeToggle/>
            </div>
        </header>
    )
}