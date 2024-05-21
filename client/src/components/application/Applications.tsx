import {useApplicationStore} from "@/store/useApplicationStore.ts";
import {useEffect} from "react";
import {ApplicationItem} from "@/components/application/ApplicationItem.tsx";


export const Applications = () => {

    const {applications, getApplications} = useApplicationStore(state => ({
        applications: state.applications,
        getApplications: state.getApplications
    }))

    useEffect(() => {
        getApplications().catch(e => console.error(e));
    }, [getApplications]);


    return (
        <div className='flex flex-col w-5/6 md:w-2/5 gap-10 pt-3'>
            {applications.map(a => (
                <ApplicationItem key={a.address} application={a}/>
            ))}
        </div>
    )
}