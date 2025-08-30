import Spacer from "@/components/ui/Spacer"
import { FilePickerWidget } from "@/pages/Recipes/components/FilePickerWidget"
import { ImagePreview } from "@/pages/Recipes/components/ImagePreview"
import { Recipe } from "@/types/api/Recipe"
import { apiClient } from "@/util/apiClient"
import { ReactElement, useEffect, useState } from "react"

type ImageUploadWidgetProps = {
    setFile: SetState<File | null>
    imagePreviewUrl: string
    setImagePreviewUrl: SetState<string>
    recipe?: Recipe
}

export const ImageUploadWidget = ({ setFile, recipe, imagePreviewUrl, setImagePreviewUrl }: ImageUploadWidgetProps): ReactElement => {
    const [
        isImagePreviewVisible,
        setImagePreviewVisible,
    ] = useState<boolean>(false)

    useEffect(() => {
        if (recipe?.image) {
            setImagePreviewUrl(apiClient.defaults.baseURL + recipe?.image?.directory + recipe?.image?.filename)
            setImagePreviewVisible(true)
        }
    }, [recipe])

    return (
        <>
            <FilePickerWidget {...{
                setFile,
                setImagePreviewVisible,
                imagePreviewUrl,
                setImagePreviewUrl,
            }} />

            {isImagePreviewVisible && (
                <>
                    <Spacer height="6" />
                    <ImagePreview url={imagePreviewUrl} alt="Bildvorschau" />
                </>
            )}
        </>
    )
}
