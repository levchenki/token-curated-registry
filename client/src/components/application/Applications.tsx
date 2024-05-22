import {useApplicationStore} from "@/store/useApplicationStore.ts";
import {useEffect} from "react";
import {ApplicationItem} from "@/components/application/ApplicationItem.tsx";
import {useAccount} from "wagmi";


export const Applications = () => {
    const {address} = useAccount()

    const {applications, getApplications} = useApplicationStore(state => ({
        applications: state.applications,
        getApplications: state.getApplications
    }))

    useEffect(() => {
        getApplications().catch(e => console.error(e));
    }, [getApplications]);


    return (
        <div className='flex flex-col w-full md:w-6/12 gap-10 pt-3'>
            {applications.map(a => (
                <ApplicationItem key={a.address} application={a} address={address}/>
            ))}
        </div>
    )
}