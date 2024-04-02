import {Separator} from "@/components/ui/separator.tsx";
import {ExternalLink, Link as LinkIcon, Trash2} from "lucide-react";
import {IRegistryItem} from "@/types/interfaces.ts";
import {Link} from "react-router-dom";
import {SEPOLIA_ETHERSCAN_URL} from "@/utils/constants.ts";


interface RegistryItemProps {
    registry: IRegistryItem
}

export const RegistryItem = ({registry}: RegistryItemProps) => {
    return (
        <div className='flex flex-col w-78 h-36 items-center px-4 pb-5 py-2 justify-between rounded-md border'>
            <p>
                {registry.name}
            </p>
            <p className='flex text-primary gap-2 items-center'>
                {registry.link}
                <Link to={registry.link} className='hover:cursor-pointer'>
                    <LinkIcon className='w-4'/>
                </Link>
            </p>
            <div className='flex flex-col w-full text-center items-center'>
                <Separator/>
                <div className='grid grid-cols-2 w-full pt-3 px-2'>
                    <Link to={`${SEPOLIA_ETHERSCAN_URL}address/${registry.address}`}
                          target='_blank'
                          className='w-fit'>
                        <ExternalLink
                            className='justify-self-start hover:text-pr hover:text-primary hover:cursor-pointer'/>
                    </Link>
                    <Trash2 className='justify-self-end hover:text-destructive hover:cursor-pointer'/>
                </div>
            </div>
        </div>
    )
}