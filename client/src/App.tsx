import {Main} from "@/layout/Main.tsx";
import {Header} from "@/layout/Header.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";

const App = () => {

    return (
        <div className='flex flex-col h-screen'>
            <Header/>
            <Main/>
            <Toaster/>
        </div>
    )
}

export default App
