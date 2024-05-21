import {Separator} from "@/components/ui/separator.tsx";
import {Applications} from "@/components/application/Applications.tsx";

export const ApplicationPage = () => {
    return (
        <>
            <h3 className='text-2xl font-bold'>Applications</h3>
            <Separator className='w-80'/>
            <Applications/>
        </>
    );
}