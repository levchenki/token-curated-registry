import {Registry} from "@/components/registry/Registry.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {AddApplicationDialog} from "@/components/registry/AddApplicationDialog.tsx";

export const RegistryPage = () => {
    return (
        <>
            <div className='flex flex-row gap-5'>
                <h3 className='text-2xl font-bold'>Registry</h3>
                <AddApplicationDialog/>
            </div>
            <Separator className='w-80'/>
            <Registry/>
        </>
    );
}