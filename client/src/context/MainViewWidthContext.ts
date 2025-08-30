import { Nullish } from "@/types/Nullish"
import { NullishContext } from "@/types/NullishContext"
import { createContext } from "react"

type MainViewWidthContextType = {
    mainViewWidth: string
    setMainViewWidth: React.Dispatch<React.SetStateAction<string>>
}

export const MainViewWidthContext: NullishContext<MainViewWidthContextType> = createContext<Nullish<MainViewWidthContextType>>(null)
