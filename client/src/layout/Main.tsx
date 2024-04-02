import {Outlet} from "react-router-dom";

export const Main = () => {
    return (
        <main className='flex-grow flex flex-col items-center gap-5 px-10 pb-10'>
            <Outlet/>
        </main>
    )
}