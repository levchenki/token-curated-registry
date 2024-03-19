import {Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import {Separator} from "@/components/ui/separator.tsx";

interface TokenInfoModalProps {
    disabled: boolean
}

export const TokenInfoModal = ({disabled}: TokenInfoModalProps) => {
    const {toast} = useToast()
    const tokenBalance = 10312.12
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline' disabled={disabled}>
                    Balance
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="grid gap-4 py-4">
                    <p>
                        <span className='font-bold'>Balance: </span>
                        {tokenBalance} TKN
                    </p>
                    <Separator/>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input type='number' placeholder="USDT"/>
                        <Button onClick={() => toast({
                            title: 'Minted',
                            description: 'Minted',
                        })}>Mint</Button>
                    </div>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input type='number' placeholder="TKN"/>
                        <Button onClick={() => toast({
                            title: 'Burned',
                            description: 'Burned',
                            variant: 'destructive',
                        })}>Burn</Button>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose>
                        <Button type="button" variant='secondary'>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}