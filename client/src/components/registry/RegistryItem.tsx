import {ExternalLink, Link as LinkIcon} from "lucide-react";
import {IRegistryItem} from "@/types/interfaces.ts";
import {Link} from "react-router-dom";
import {getEtherscanAddressLink, shortenAddress} from "@/utils/helpers.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {ChallengeElementButton} from "@/components/registry/ChallengeElementButton.tsx";


interface RegistryItemProps {
    registry: IRegistryItem
    address?: `0x${string}`
}

export const RegistryItem = ({registry, address}: RegistryItemProps) => {
    return (
        <div className='flex flex-col w-5/6 h-fit items-center px-4 pb-5 py-2 justify-between rounded-md border'>
            <div className='flex flex-row justify-between w-full items-center mt-2 px-3 gap-10'>
                <div className='text-lg text-primary font-bold hover:underline underline-offset-4'>
                    <Link to={registry.link} target='_blank'>
                        <div className='flex items-center gap-2 text-md'>
                            <p>{registry.name}</p>
                            <LinkIcon className='w-4'/>
                        </div>
                    </Link>
                </div>
                <Badge variant='outline' className='flex items-center gap-3'>
                    Check on Etherscan
                    <Link to={getEtherscanAddressLink(registry.address)}
                          target='_blank'
                          className='w-fit'>
                        <ExternalLink size={16}
                                      className='justify-self-start hover:cursor-pointer'/>
                    </Link>
                </Badge>
            </div>
            <div className='grid grid-cols-2 w-full gap-10 items-center justify-center mt-8'>
                <div className='grid grid-cols-2 w-full gap-2'>
                    <p>Owner: </p>
                    <p className='underline'>
                        <Link to={getEtherscanAddressLink(registry.address)}
                              target='_blank'
                              className='w-fit'>
                            {shortenAddress(registry.address)}
                        </Link>
                    </p>
                    <p>Added at: </p>
                    <p className='underline'>{registry.addedDate.toLocaleString()}</p>
                </div>
                <div className='flex flex-col gap-2 self-end'>
                    <ChallengeElementButton address={address} registryItem={registry}/>
                </div>
            </div>
        </div>
    )
}