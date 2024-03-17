import {Moon, Sun} from "lucide-react"

import {Button} from "@/components/ui/button.tsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {getSystemTheme, useTheme} from "@/components/theme/ThemeProvider.tsx"
import {web3Modal} from "@/components/wallet/Web3ModalProvider.tsx";

export const ModeToggle = () => {
    const {setTheme} = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun
                        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                    <Moon
                        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                    setTheme("light")
                    web3Modal.setThemeMode("light")
                }}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                    setTheme("dark")
                    web3Modal.setThemeMode("dark")
                }}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                    setTheme("system")
                    web3Modal.setThemeMode(getSystemTheme())
                }}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
