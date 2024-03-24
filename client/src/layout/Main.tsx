import {Outlet} from "react-router-dom";

export const Main = () => {
    return (
        <main className='flex-grow flex flex-col items-center'>
            <Outlet/>
        </main>
    )
}