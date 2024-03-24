import {Outlet} from "react-router-dom";

export const Main = () => {
    return (
        <main className='flex-grow flex flex-col items-center mx-20 gap-5 px-10'>
            <Outlet/>
        </main>
    )
}