import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { GlobalAppData } from "@/types/GlobalAppData"

export const useGlobalResources = <T extends keyof GlobalAppData>(resources: T): GlobalAppData[T] => {
    const globalAppData: GlobalAppData = useNullishContext(GlobalAppDataContext)
    return globalAppData[resources]
}
