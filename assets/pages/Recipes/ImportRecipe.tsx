import Button from "@/components/ui/Buttons/Button"
import FileSelectButton from "@/components/ui/Buttons/FileSelectButton"
import IconButton from "@/components/ui/Buttons/IconButton"
import Card from "@/components/ui/Card"
import Notification from "@/components/ui/Notification"
import Spacer from "@/components/ui/Spacer"
import Spinner from "@/components/ui/Spinner"
import { StandardContentWrapper } from "@/components/ui/StandardContentWrapper"
import { DATEI_AUSWAEHLEN } from "@/pages/Recipes/constants/DATEI_AUSWAEHLEN"
import { BasePageComponentProps } from "@/types/BasePageComponentProps"
import { RecipeExportDto } from "@/types/datatransferobjects/RecipeExportDto"
import { PageState } from "@/types/enums/PageState"
import RecipeModel from "@/types/RecipeModel"
import axios from "axios"
import React, { ReactElement, useEffect, useState } from "react"

type ImportRecipeProps = BasePageComponentProps & {
    recipes: EntityState<RecipeModel[]>
}

type ImportedRecipeExportDto = RecipeExportDto & {
    isSelected: boolean
}

enum ReadFileState {
    WAITING, READING, ERROR
}

export const ImportRecipe = (props: ImportRecipeProps): ReactElement => {
    const [uploadButtonText, setUploadButtonText] = useState<string>(DATEI_AUSWAEHLEN)
    const [file, setFile] = useState<File | null>(null)
    const [state, setState] = useState<PageState>(PageState.WAITING)
    const [readFileState, setReadFileState] = useState<ReadFileState>(ReadFileState.WAITING)
    const [importedRecipes, setImportedRecipes] = useState<ImportedRecipeExportDto[]>([])
    const [errorRecipes, setErrorRecipes] = useState<ImportedRecipeExportDto[]>([])

    const handleFilePick = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const uploadedFile: File | null = event.target.files?.[0] || null
        const filename: string = uploadedFile?.name || ''

        setUploadButtonText(filename || DATEI_AUSWAEHLEN)
        setFile(uploadedFile)
    }

    const handleReadFileError = (): void => {
        setReadFileState(ReadFileState.ERROR)
        resetReadFileState()
    }

    const readImportedRecipeExportDtos = async (file: File): Promise<ImportedRecipeExportDto[]> => {
        const readJsonFileContents = async (file: File): Promise<RecipeExportDto | RecipeExportDto[]> => {
            return new Promise<RecipeExportDto | RecipeExportDto[]>((resolve, reject): void => {
                const reader: FileReader = new FileReader()

                reader.onload = (event: ProgressEvent<FileReader>): void => {
                    try {
                        const jsonFileContents: RecipeExportDto | RecipeExportDto[] = JSON.parse(event.target?.result?.toString() || '')
                        resolve(jsonFileContents)
                    } catch (error) {
                        handleReadFileError()
                    }
                }

                reader.onerror = (error: ProgressEvent<FileReader>): void => {
                    reject(error)
                }

                reader.readAsText(file)
            })
        }

        const jsonFileContents: RecipeExportDto | RecipeExportDto[] = await readJsonFileContents(file)

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
        setUploadButtonText(DATEI_AUSWAEHLEN)
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
        let tmpErrorRecipes: ImportedRecipeExportDto[] = []
        const doImportRequest = async (recipeExportDto: ImportedRecipeExportDto) => {
            try {
                await axios.post(`/api/import/recipes`, [recipeExportDto]) // ignore response
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
                .map(recipe => doImportRequest(recipe))
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

        props.recipes.load()
    }

    useEffect(() => {
        props.setSidebar('recipes')
        props.setTopbar({
            title: 'Rezepte importieren',
            showBackButton: true,
            backButtonPath: '/recipe/add',
        })

        window.scrollTo(0, 0)
    }, []);

    return (
        <StandardContentWrapper className="md:max-w-[600px]">
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

            {state === PageState.LOADING || props.recipes.isLoading ? (
                <Spinner />
            ) : (
                <form onSubmit={handleSubmit}>
                    <Card>
                        <p>
                            Über den JSON-Upload können ein oder mehrere Rezepte in den FoodPlanner importiert werden.
                            Du kannst eine gültige JSON-Datei entweder über ein individuelles Rezept über den
                            Download-Button erzeugen oder in der Rezepte-Übersicht über den Download-Button
                            einen <em>Full Export</em> aller Rezepte anfordern.
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
                    </Card>

                    {readFileState === ReadFileState.READING && (
                        <Spinner />
                    )}

                    {importedRecipes.length > 0 && (
                        <>
                            <Spacer height={6} />
                            <Card>
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
                                    </div>
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
                            </Card>
                        </>
                    )}
                </form>
            )}
        </StandardContentWrapper>
    )
}
