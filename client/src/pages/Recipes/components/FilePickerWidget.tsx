import FileSelectButton from "@/components/ui/Buttons/FileSelectButton"
import IconButton from "@/components/ui/Buttons/IconButton"
import { DATEI_AUSWAEHLEN } from "@/pages/Recipes/constants/DATEI_AUSWAEHLEN"
import React, { ReactElement, useState } from "react"

type FilePickerWidgetProps = {
    setFile: SetState<File | null>
    setImagePreviewVisible: SetState<boolean>
    imagePreviewUrl: string
    setImagePreviewUrl: SetState<string>
}

export const FilePickerWidget = ({
    setFile,
    setImagePreviewVisible,
    imagePreviewUrl,
    setImagePreviewUrl,
}: FilePickerWidgetProps): ReactElement => {
    const [
        uploadButtonText,
        setUploadButtonText,
    ] = useState<string>(DATEI_AUSWAEHLEN)

    const handleFilePick = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const uploadedFile: File | null = event.target.files?.[0] || null
        const filename: string = uploadedFile?.name || ''

        setUploadButtonText(filename || DATEI_AUSWAEHLEN)
        setFile(uploadedFile)

        if (uploadedFile !== null) {
            setImagePreviewVisible(true)
            setImagePreviewUrl(URL.createObjectURL(uploadedFile))
        }
    }

    const handleDeleteUploadedImage = (): void => {
        setUploadButtonText(DATEI_AUSWAEHLEN)
        setFile(null)
        setImagePreviewVisible(false)
        setImagePreviewUrl('')
    }

    return (
        <>
            <div className="text-sm font-semibold block mb-2">Bild hochladen</div>

            <div className="flex justify-between items-center gap-4 h-10">
                <div className="overflow-hidden w-full">
                    <FileSelectButton
                        id="image"
                        label={uploadButtonText}
                        onChange={handleFilePick}
                    />
                </div>

                {imagePreviewUrl.length > 0 &&
                    <IconButton
                        outlined={true}
                        onClick={handleDeleteUploadedImage}
                    >
                        delete
                    </IconButton>
                }
            </div>
        </>
    )
}
