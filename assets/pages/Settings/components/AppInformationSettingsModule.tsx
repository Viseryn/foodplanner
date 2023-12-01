import React, { ReactElement } from 'react'
import Spinner from '@/components/ui/Spinner'
import InstallationStatusModel from '@/types/InstallationStatusModel'

type AppInformationSettingsModuleProps = {
    installationStatus: EntityState<InstallationStatusModel>
}

export const AppInformationSettingsModule = (props: AppInformationSettingsModuleProps): ReactElement => {
    const { installationStatus } = props

    return (
        <>
            {installationStatus.isLoading ? (
                <Spinner verticalMargin={10} />
            ) : (
                <>
                    <div className="flex items-center">
                        <div className="">
                            <img src="/img/favicon.png" className="mx-auto" alt="FoodPlanner Favicon" />
                        </div>
                        <div className="text-sm ml-4">
                            <div className="font-semibold">FoodPlanner</div>
                            <div className="text-xs">
                                <a
                                    href={`https://github.com/Viseryn/foodplanner/releases/tag/${installationStatus.data.version}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {installationStatus.data.version}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs mt-4">
                        &copy; 2023 Kevin Sporbeck
                    </div>
                </>
            )}
        </>
    )
}
