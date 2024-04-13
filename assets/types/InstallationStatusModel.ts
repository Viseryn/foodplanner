import { Nullish } from "@/types/Nullish"

type InstallationStatusModel = {
    id: number
    status: Nullish<boolean>
    updateV16: Nullish<boolean>
    version: Nullish<string>
}

export default InstallationStatusModel
