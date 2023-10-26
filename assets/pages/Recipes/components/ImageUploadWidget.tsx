import React, { ReactElement, useEffect, useState } from 'react'
import { FilePickerWidget } from '@/pages/Recipes/components/FilePickerWidget'
import Spacer from '@/components/ui/Spacer'
import { ImagePreview } from '@/pages/Recipes/components/ImagePreview'
import RecipeModel from '@/types/RecipeModel'

type ImageUploadWidgetProps = {
    setFile: SetState<File | null>
    imagePreviewUrl: string
    setImagePreviewUrl: SetState<string>
    recipe?: RecipeModel
}

export const ImageUploadWidget = ({ setFile, recipe, imagePreviewUrl, setImagePreviewUrl }: ImageUploadWidgetProps): ReactElement => {
    const [
        isImagePreviewVisible,
        setImagePreviewVisible,
    ] = useState<boolean>(false)

    useEffect(() => {
        if (recipe?.image) {
            setImagePreviewUrl('' + recipe?.image?.directory + recipe?.image?.filename)
            setImagePreviewVisible(true)
        }
    }, [recipe]);

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
