import { Spinner } from "@/components/ui/Spinner"
import { AppContext } from "@/context/AppContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { InstallationStatus } from "@/types/api/InstallationStatus"
import { ManagedResource } from "@/types/ManagedResource"
import { CLIENT_VERSION } from "@/util/env/CLIENT_VERSION"
import { ReactElement } from "react"

export const AppInformationSettingsModule = (): ReactElement => {
    const installationStatus: ManagedResource<InstallationStatus> = useNullishContext(AppContext).installationData.installation
    const clientVersion: string = CLIENT_VERSION

    return (
        <>
            {installationStatus.isLoading ? (
                <Spinner verticalMargin={10} />
            ) : (
                <>
                    <div className="flex items-center justify-start gap-6">
                        <div className="">
                            <img src="/img/icons/192-transparent.png" className="w-16 h-16 mx-auto" alt="FoodPlanner" />
                        </div>
                        <div className="flex-grow flex-col flex text-xs justify-between h-16">
                            <div className="text-sm font-semibold">FoodPlanner</div>
                            <div className="">
                                <a
                                    href={`https://github.com/Viseryn/foodplanner/releases/tag/v${clientVersion}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className="flex gap-1">
                                        <div>v{clientVersion}</div>
                                        <div className={"material-symbols-rounded text-xs mt-[1px]"}>open_in_new</div>
                                    </div>
                                </a>
                            </div>
                            <div className="">
                                &copy; 2025 Kevin Sporbeck
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
