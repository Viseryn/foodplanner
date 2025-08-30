import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Spacer from "@/components/ui/Spacer"
import { ReactElement } from "react"

/**
 * A components that renders a skeleton for a Day card in the mobile Planner view.
 */
export default function DaySkeletonMobile(): ReactElement {
    return <OuterCard>
        <div className="animate-pulse">
            <div className="h-7 bg-notification-500 dark:bg-notification-700 rounded-full w-3/4 md:w-1/2"></div>
        </div>

        <Spacer height="4" />

        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            <div className="rounded-xl h-40 w-full object-cover bg-notification-500 dark:bg-notification-700" />
            <div className="rounded-xl h-40 w-full object-cover bg-notification-500/75 dark:bg-notification-700/75" />

            <div className="rounded-2xl h-14 sm:col-span-2 w-full object-cover bg-notification-500 dark:bg-notification-700" />
        </div>
    </OuterCard>
}
