import Button from "@/components/ui/Buttons/Button"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Spacer from "@/components/ui/Spacer"
import { ReactElement } from "react"

/**
 * A components that renders a skeleton for the Day carousel in the desktop Planner view.
 * 
 * @param props
 * @param props.gap The gap of the carousel.
 * @param props.columsn The number of visible columns of the carousel.
 */
export default function DaySkeletonDesktop({ gap, columns }: {
    gap: number
    columns: number
}): ReactElement {
    // Day with one meal
    const day1: ReactElement = (
        <div className="flex flex-col gap-2 w-40">
            <div className="flex justify-between items-center pb-2 animate-pulse">
                <div className="w-full">
                    <div className="h-6 bg-notification-500 dark:bg-notification-700 rounded-full w-1/2" />
                    <Spacer height="2" />
                    <div className="h-6 bg-notification-500 dark:bg-notification-700 rounded-full w-3/4" />
                </div>

                <Button icon="add" role="disabled" />
            </div>

            <div className="animate-pulse">
                <div className="h-40 w-40 rounded-2xl object-cover bg-notification-500 dark:bg-notification-700" />
            </div>
        </div>
    )

    // Day with two meals
    const day2: ReactElement = (
        <div className="flex flex-col gap-2 w-40">
            <div className="flex justify-between items-center pb-2 animate-pulse">
                <div className="w-full">
                    <div className="h-6 bg-notification-500 dark:bg-notification-700 rounded-full w-1/2" />
                    <Spacer height="2" />
                    <div className="h-6 bg-notification-500 dark:bg-notification-700 rounded-full w-3/4" />
                </div>

                <Button icon="add" role="disabled" />
            </div>

            <div className="flex flex-col gap-2 animate-pulse">
                <div className="h-40 w-40 rounded-2xl object-cover bg-notification-500 dark:bg-notification-700" />
                <div className="h-40 w-40 rounded-2xl object-cover bg-notification-500 dark:bg-notification-700" />
            </div>
        </div>
    )

    // Render DaySkeletonDesktop
    return (
        <OuterCard>
            <div className="flex" style={{ gap: `${4 * gap}px` }}>
                {day2}
                {day1}
                {day2}

                {columns > 3 && 
                    <>
                        {day2}
                        {day1}
                    </>
                }
            </div>

            <Spacer height="6" />

            <div className="flex justify-between select-none">
                <Button
                    icon="navigate_before"
                    label="Zurück"
                    role="disabled"
                    isSmall={true}
                />
                <Button
                    icon="navigate_next"
                    label="Weiter"
                    role="disabled"
                    isIconRight={true}
                    isSmall={true}
                />
            </div>
        </OuterCard>
    )
}
