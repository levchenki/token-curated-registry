import {Header} from "@/layout/Header.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import {AppRouter} from "@/routes/AppRouter.tsx";

const App = () => {

    return (
        <div className='flex flex-col h-screen'>
            <Header/>
            <AppRouter/>
            <Toaster/>
        </div>
    )
}

export default App
