import {Registry} from "@/components/registry/Registry.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {UserRoundPlus} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";

export const RegistryPage = () => {
    return (
        <>
            <div className='flex flex-row gap-5'>
                <h3 className='text-2xl font-bold'>Registry</h3>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button>
                                <UserRoundPlus/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add a new item to the registry</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
            <Separator className='w-80'/>
            <Registry/>
        </>
    );
}