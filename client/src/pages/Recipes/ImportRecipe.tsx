import Button from "@/components/ui/Buttons/Button"
import FileSelectButton from "@/components/ui/Buttons/FileSelectButton"
import IconButton from "@/components/ui/Buttons/IconButton"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Notification from "@/components/ui/Notification"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { PICK_FILE } from "@/pages/Recipes/constants/PICK_FILE"
import { Detached } from "@/types/api/Detached"
import { Image } from "@/types/api/Image"
import { Recipe } from "@/types/api/Recipe"
import { Base64Image } from "@/types/Base64Image"
import { RecipeExport } from "@/types/datatransferobjects/RecipeExport"
import { PageState } from "@/types/enums/PageState"
import { GlobalAppData } from "@/types/GlobalAppData"
import { Maybe } from "@/types/Maybe"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { ApiRequest } from "@/util/ApiRequest"
import axios from "axios"
import React, { ReactElement, useEffect, useState } from "react"

type ImportedRecipeExportDto = RecipeExport & {
    isSelected: boolean
}

enum ReadFileState {
    WAITING, READING, ERROR
}

/**
 * Builds a `Detached<Recipe>` and a `Base64Image` that can be sent to the usual `Recipe` APIs.
 */
const createRecipe = (importRecipe: ImportedRecipeExportDto): [Detached<Recipe>, Base64Image] => {
    const imageUniqueFilename = (length: number): string => {
        let result: string = ""
        const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        const charactersLength: number = characters.length

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }

        return result
    }

    return [{
        "@type": "Recipe",
        ingredients: importRecipe.ingredients.map(importIngredient => ({ ...importIngredient, "@type": "Ingredient" })),
        instructions: importRecipe.instructions.map(importInstruction => ({ ...importInstruction, "@type": "Instruction" })),
        portionSize: importRecipe.portionSize,
        title: importRecipe.title,
        externalUrl: importRecipe.externalUrl,
    }, {
        "@type": "Image",
            imageContents: importRecipe.image,
            filename: imageUniqueFilename(16),
            directory: "/img/recipes/",
            public: true,
    }]
}

export const ImportRecipe = (): ReactElement => {
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const { recipes }: Partial<GlobalAppData> = useNullishContext(GlobalAppDataContext)

    const [uploadButtonText, setUploadButtonText] = useState<string>(PICK_FILE)
    const [file, setFile] = useState<File | null>(null)
    const [state, setState] = useState<PageState>(PageState.WAITING)
    const [readFileState, setReadFileState] = useState<ReadFileState>(ReadFileState.WAITING)
    const [importedRecipes, setImportedRecipes] = useState<ImportedRecipeExportDto[]>([])
    const [errorRecipes, setErrorRecipes] = useState<ImportedRecipeExportDto[]>([])

    const handleFilePick = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const uploadedFile: File | null = event.target.files?.[0] || null
        const filename: string = uploadedFile?.name || ""

        setUploadButtonText(filename || PICK_FILE)
        setFile(uploadedFile)
    }

    const handleReadFileError = (): void => {
        setReadFileState(ReadFileState.ERROR)
        resetReadFileState()
    }

    const readImportedRecipeExportDtos = async (file: File): Promise<ImportedRecipeExportDto[]> => {
        const readJsonFileContents = async (file: File): Promise<RecipeExport | RecipeExport[]> => {
            return new Promise<RecipeExport | RecipeExport[]>((resolve, reject): void => {
                const reader: FileReader = new FileReader()

                reader.onload = (event: ProgressEvent<FileReader>): void => {
                    try {
                        const jsonFileContents: RecipeExport | RecipeExport[] = JSON.parse(event.target?.result?.toString() || "")
                        resolve(jsonFileContents)
                    } catch {
                        handleReadFileError()
                    }
                }

                reader.onerror = (error: ProgressEvent<FileReader>): void => {
                    reject(error)
                }

                reader.readAsText(file)
            })
        }

        const jsonFileContents: RecipeExport | RecipeExport[] = await readJsonFileContents(file)

        return (Array.isArray(jsonFileContents) ? jsonFileContents : [jsonFileContents])
            .map(recipe => ({ ...recipe, isSelected: true }))
    }

    const handleReadFileButton = async (): Promise<void> => {
        if (file === null) {
            return
        }

        setState(PageState.WAITING)
        setReadFileState(ReadFileState.READING)
        const importedRecipeExportDtos: ImportedRecipeExportDto[] = await readImportedRecipeExportDtos(file)
        setImportedRecipes(importedRecipeExportDtos)
        setReadFileState(ReadFileState.WAITING)
    }

    const resetReadFileState = (): void => {
        setFile(null)
        setImportedRecipes([])
        setUploadButtonText(PICK_FILE)
    }

    const handleCheckboxChange = (selectedRecipeExportDto: ImportedRecipeExportDto): void => {
        const newImportedRecipes: ImportedRecipeExportDto[] = [...importedRecipes]
        const recipe: ImportedRecipeExportDto = newImportedRecipes?.[newImportedRecipes.indexOf(selectedRecipeExportDto)]
        recipe.isSelected = !recipe.isSelected
        setImportedRecipes(newImportedRecipes)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        setState(PageState.LOADING)
        setErrorRecipes([])

        let errorCount: number = 0
        const tmpErrorRecipes: ImportedRecipeExportDto[] = []
        const doImportRequest = async (recipeExportDto: ImportedRecipeExportDto) => {
            try {
                const [recipe, image]: [Detached<Recipe>, Base64Image] = createRecipe(recipeExportDto)
                const recipeResponse: Maybe<Recipe> = await ApiRequest.post<Recipe>(`/api/recipes`, recipe).build().getResponse()

                if (recipeResponse && image.imageContents) {
                    await ApiRequest.patch<Image>(`${ recipeResponse["@id"] }/image`, image).execute()
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    errorCount++
                    tmpErrorRecipes.push(recipeExportDto)
                    setErrorRecipes(errorRecipes => [...errorRecipes, recipeExportDto])
                }
            }
        }

        await Promise.all(
            importedRecipes
                .filter(recipe => recipe.isSelected)
                .map(recipe => doImportRequest(recipe)),
        )

        if (errorCount === importedRecipes.filter(recipe => recipe.isSelected).length) {
            setState(PageState.ERROR)
            resetReadFileState()
        } else if (errorCount > 0) {
            setState(PageState.WAITING)
            resetReadFileState()
            setImportedRecipes(tmpErrorRecipes)
        } else if (errorCount == 0) {
            setState(PageState.SUCCESS)
            resetReadFileState()
        }

        recipes.load()
    }

    useEffect(() => {
        sidebar.configuration
               .activeItem("recipes")
               .rebuild()

        topbar.configuration
              .title("Rezepte importieren")
              .backButton({ isVisible: true, path: "/recipes" })
              .mainViewWidth("md:max-w-[600px]")
              .rebuild()

        window.scrollTo(0, 0)
    }, [])

    return (
        <StandardContentWrapper>
            {readFileState === ReadFileState.ERROR && <>
                <Notification color="red">Die ausgewählte Datei konnte nicht gelesen werden.</Notification>
                <Spacer height={6} />
            </>}

            {state === PageState.ERROR && <>
                <Notification color="red">Die ausgewählte Datei konnte nicht importiert werden.</Notification>
                <Spacer height={6} />
            </>}

            {state === PageState.SUCCESS && <>
                <Notification color="green">Die Rezepte wurden erfolgreich importiert.</Notification>
                <Spacer height={6} />
            </>}

            {state === PageState.LOADING || recipes.isLoading ? (
                <Spinner />
            ) : (
                <form onSubmit={handleSubmit}>
                    <OuterCard>
                        <p>
                            Du kannst hier ein über eine FoodPlanner-App exportiertes Rezept im JSON-Dateiformat importieren.
                        </p>

                        <Spacer height={6} />

                        <div>
                            <FileSelectButton
                                id="image"
                                label={uploadButtonText}
                                onChange={handleFilePick}
                            />
                        </div>

                        <Spacer height={6} />

                        <div className="flex justify-end">
                            <Button
                                icon="folder_open"
                                label="Rezepte-Datei öffnen"
                                isSmall={true}
                                role={file === null || readFileState === ReadFileState.READING ? "disabled" : "primary"}
                                onClick={handleReadFileButton}
                            />
                        </div>
                    </OuterCard>

                    {readFileState === ReadFileState.READING && (
                        <Spinner />
                    )}

                    {importedRecipes.length > 0 && (
                        <>
                            <Spacer height={6} />
                            <OuterCard>
                                <p>
                                    Die folgenden Rezepte wurden aus der Rezepte-Datei eingelesen.
                                    Du kannst markieren, welche Rezepte du importieren möchtest.
                                </p>

                                <Spacer height={6} />

                                {errorRecipes.length > 0 && <>
                                    <Notification color="red">
                                        Die folgenden Rezepte konnten aufgrund eines Übertragungsfehlers nicht importiert werden.
                                        Du kannst nochmal versuchen, sie zu importieren.
                                    </Notification>
                                    <Spacer height={6} />
                                </>}

                                {importedRecipes.map((selectedRecipeExportDto, index) =>
                                    <div key={index} className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <IconButton style={"mr-4"} onClick={() => handleCheckboxChange(selectedRecipeExportDto)}>
                                                {selectedRecipeExportDto.isSelected ? "check_box" : "check_box_outline_blank"}
                                            </IconButton>
                                            {selectedRecipeExportDto.title}
                                        </div>
                                    </div>,
                                )}

                                <Spacer height={6} />

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        icon="upload"
                                        label="Rezepte importieren"
                                        isSmall={true}
                                        role="primary"
                                    />
                                </div>
                            </OuterCard>
                        </>
                    )}
                </form>
            )}
        </StandardContentWrapper>
    )
}
