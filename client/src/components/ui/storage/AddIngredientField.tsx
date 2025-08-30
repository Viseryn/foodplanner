import { Detached } from "@/types/api/Detached"
import { Ingredient } from "@/types/api/Ingredient"
import { PANTRY_IRI } from "@/types/constants/PANTRY_IRI"
import { SHOPPINGLIST_IRI } from "@/types/constants/SHOPPINGLIST_IRI"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { Sortable } from "@/types/Sortable"
import { StorageIngredient } from "@/types/StorageIngredient"
import { ApiRequest } from "@/util/ApiRequest"
import { createIngredient } from "@/util/ingredients/createIngredient"
import { getHighestPosition } from "@/util/ingredients/getHighestPosition"
import { StringBuilder } from "@/util/StringBuilder"
import { ReactElement, useState } from "react"

type AddIngredientFieldProps = {
    storage: ManagedResourceCollection<StorageIngredient>,
    storageIri: typeof SHOPPINGLIST_IRI | typeof PANTRY_IRI,
    roundedRight?: boolean,
}

export const AddIngredientField = (props: AddIngredientFieldProps): ReactElement => {
    const { storage, storageIri }: AddIngredientFieldProps = props
    const roundedRight: boolean = props.roundedRight ?? true
    const [inputValue, setInputValue] = useState<string>("")

    /**
     * Handles all keyboard presses. On enter presses the function checks whether the `inputValue` is
     * more than whitespace, and if yes, will call the function `handleEnterKeyDown` with the trimmed
     * `inputValue` as argument.
     */
    const handleKeyDown = (event: React.KeyboardEvent): void => {
        if (event.key !== "Enter") {
            return
        }

        // Only accept input if it consists of more than whitespaces
        if (inputValue.trim().length > 0) {
            void handleEnterKeyDown(inputValue.trim())
        }
    }

    const handleEnterKeyDown = async (value: string): Promise<void> => {
        if (storage.isLoading) {
            return
        }

        const storageCopy: StorageIngredient[] = [...storage.data]

        setInputValue("")

        const ingredientToAdd: Detached<StorageIngredient> = {
            ...createIngredient(value, getHighestPosition(storage.data) + 1) as Detached<Ingredient & Sortable>,
            storage: storageIri,
            checked: false,
        }

        // Optimistically add a dummy ingredient to the list so that we don't have to wait for the POST request to be finished
        storage.setData([createDummyIngredient(storage.data, ingredientToAdd), ...storageCopy])

        await ApiRequest
            .post<StorageIngredient>("/api/ingredients", ingredientToAdd)
            .ifSuccessful((responseData: StorageIngredient) => {
                // Override the dummy ingredient with the real Ingredient resource.
                // We use storageCopy to have the unedited list.
                storage.setData([responseData, ...storageCopy])
            })
            .execute()
    }

    return (
        <div className={StringBuilder.cn(
            roundedRight ? "rounded-full" : "rounded-l-[2rem] rounded-r-lg",
            "font-semibold bg-secondary-100 dark:bg-secondary-dark-200 h-14 flex items-center pl-6 pr-4 flex-1",
        )}>
            <span className="material-symbols-rounded mr-2 cursor-default">
                add
            </span>

            <input
                className="bg-secondary-100 dark:bg-secondary-dark-200 placeholder-secondary-900  dark:placeholder-secondary-dark-900 w-full border-transparent focus:border-transparent focus:ring-0"
                placeholder={"Zutat hinzufügen..."}
                type="text"
                value={inputValue}
                onChange={event => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
            />

            {inputValue && (
                <span
                    className="material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-secondary-300 dark:hover:bg-secondary-dark-300 p-2 rounded-full"
                    onClick={() => setInputValue("")}
                >
                    close
                </span>
            )}
        </div>
    )
}

/**
 * Creates a technically full `StorageIngredient` that is de facto detached, but has an id so that it can be added to the list before the POST request was
 * successful.
 */
const createDummyIngredient = (storageData: StorageIngredient[], detachedIngredient: Detached<StorageIngredient>): StorageIngredient => {
    const lowestId: number = storageData.map(it => it.id).sort((a, b) => a - b)?.[0]
    const dummyId: number = (lowestId > 0 ? lowestId * -1 : lowestId) - 1

    return {
        ...detachedIngredient,
        id: dummyId,
        "@id": `/api/ingredients/${dummyId}`,
    }
}
