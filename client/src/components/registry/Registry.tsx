import {RegistryItem} from "@/components/registry/RegistryItem.tsx";
import {useEffect} from "react";
import {useRegistryStore} from "@/store/useRegistryStore.ts";

export const Registry = () => {
    const {registry, getRegistry} = useRegistryStore(state => ({
        registry: state.registry,
        getRegistry: state.getRegistry
    }))

    useEffect(() => {
        getRegistry().catch(e => console.error(e));
    }, [getRegistry]);

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-10 md:gap-10 pt-3'>
            {registry.map(r => (
                <RegistryItem key={r.address} registry={r}/>
            ))}
        </div>
    )
}