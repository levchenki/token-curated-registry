import {Button} from "@/components/ui/button.tsx";
import {Eye} from "lucide-react";

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip.tsx"


export const TokenButton = () => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="icon" variant='outline'>
                        <Eye size='22'/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add token to the wallet</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

