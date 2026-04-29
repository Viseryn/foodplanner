import { StringBuilder } from "@/util/StringBuilder"
import { ReactElement } from "react"

export const EmptyStorageInfo = (): ReactElement => {
    return (
        <div className="flex-col justify-between items-center bg-secondary-100 dark:bg-secondary-dark-200 min-h-14 rounded-t-md rounded-b-3xl p-6">
            <div className="flex items-center">
                <span className="material-symbols-rounded outlined mr-5">info</span>
                <span className="font-semibold">Die Liste ist leer.</span>
            </div>

            <img src="/img/sleeping.png" className={StringBuilder.cn(
                "max-w-[400px] max-h-[400px] w-full mx-auto transition duration-300",
            )} alt="FoodPlanner" />
        </div>
    )
}
