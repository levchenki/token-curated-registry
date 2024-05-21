import {Registry} from "@/components/registry/Registry.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {AddItemDialog} from "@/components/registry/AddItemDialog.tsx";

export const RegistryPage = () => {
    return (
        <>
            <div className='flex flex-row gap-5'>
                <h3 className='text-2xl font-bold'>Registry</h3>
                <AddItemDialog/>
            </div>
            <Separator className='w-80'/>
            <Registry/>
        </>
    );
}