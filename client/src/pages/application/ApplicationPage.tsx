import {Separator} from "@/components/ui/separator.tsx";
import {Applications} from "@/components/application/Applications.tsx";
import {AddApplicationDialog} from "@/components/registry/AddApplicationDialog.tsx";

export const ApplicationPage = () => {
    return (
        <>
            <div className='flex flex-row gap-5'>
                <h3 className='text-2xl font-bold'>Applications</h3>
                <AddApplicationDialog/>
            </div>
            <Separator className='w-80'/>
            <Applications/>
        </>
    );
}