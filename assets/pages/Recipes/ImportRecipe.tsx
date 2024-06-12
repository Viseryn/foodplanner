import Button from "@/components/ui/Buttons/Button"
import FileSelectButton from "@/components/ui/Buttons/FileSelectButton"
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
import { tryApiRequest } from "@/util/tryApiRequest"
import axios, { AxiosResponse } from "axios"
import React, { ReactElement, useEffect, useState } from "react"

type ImportRecipeProps = BasePageComponentProps & {
    recipes: EntityState<RecipeModel[]>
}

export const ImportRecipe = (props: ImportRecipeProps): ReactElement => {
    const [uploadButtonText, setUploadButtonText] = useState<string>(DATEI_AUSWAEHLEN)
    const [file, setFile] = useState<File | null>(null)
    const [state, setState] = useState<PageState>(PageState.LOADING)
    const [importedRecipes, setImportedRecipes] = useState<number>(0)

    const handleFilePick = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const uploadedFile: File | null = event.target.files?.[0] || null
        const filename: string = uploadedFile?.name || ''

        setUploadButtonText(filename || DATEI_AUSWAEHLEN)
        setFile(uploadedFile)
    }

    const getJsonFileContents = async (file: File): Promise<RecipeExportDto | RecipeExportDto[]> => {
        return new Promise<RecipeExportDto | RecipeExportDto[]>((resolve, reject): void => {
            const reader: FileReader = new FileReader()

            reader.onload = (event: ProgressEvent<FileReader>): void => {
                try {
                    const jsonFileContents: RecipeExportDto | RecipeExportDto[] = JSON.parse(event.target?.result?.toString() || '')
                    resolve(jsonFileContents)
                } catch (error) {
                    setState(PageState.ERROR)
                    setFile(null)
                    setUploadButtonText(DATEI_AUSWAEHLEN)
                }
            }

            reader.onerror = (error: ProgressEvent<FileReader>): void => {
                reject(error)
            }

            reader.readAsText(file)
        })
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        if (file === null) {
            return
        }

        setState(PageState.LOADING)

        const recipeExportDtos: RecipeExportDto | RecipeExportDto[] = await getJsonFileContents(file)
        const response: boolean = await tryApiRequest("POST", `/api/import/recipes`, async apiUrl => {
            const response: AxiosResponse<RecipeModel[]> = await axios.post(apiUrl, Array.isArray(recipeExportDtos) ? recipeExportDtos : [recipeExportDtos])
            setImportedRecipes(response.data.length)
            return response
        })

        if (response) {
            setState(PageState.SUCCESS)
            setFile(null)
            setUploadButtonText(DATEI_AUSWAEHLEN)
            props.recipes.load()
        } else {
            setState(PageState.ERROR)
            setFile(null)
            setUploadButtonText(DATEI_AUSWAEHLEN)
        }
    }

    useEffect(() => {
        if (props.recipes.isLoading) {
            return
        }

        if (importedRecipes === 0) {
            setState(PageState.WAITING)
        }
    }, [props.recipes])

    useEffect(() => {
        props.setSidebar('recipes')
        props.setTopbar({
            title: 'Rezepte aus JSON importieren',
            showBackButton: true,
            backButtonPath: '/recipe/add',
        })

        window.scrollTo(0, 0)
    }, []);

    return (
        <StandardContentWrapper className="md:max-w-[600px]">
            {state === PageState.SUCCESS && <>
                <Notification color="green">Es wurde(n) erfolgreich {importedRecipes} Rezept(e) importiert.</Notification>
                <Spacer height={6} />
            </>}

            {state === PageState.ERROR && <>
                <Notification color="red">Die ausgewählte Datei konnte nicht importiert werden.</Notification>
                <Spacer height={6} />
            </>}

            {state === PageState.LOADING ? (
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
                    </Card>

                    <div className="flex justify-end md:mt-4 pb-[5.5rem] md:pb-0">
                        {file != null && (
                            <Button
                                type="submit"
                                icon="upload"
                                label="Importieren"
                                isElevated={true}
                                outlined={true}
                                isFloating={true}
                            />
                        )}
                    </div>
                </form>
            )}
        </StandardContentWrapper>
    )
}
