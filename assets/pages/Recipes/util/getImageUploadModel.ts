import ImageUploadModel from '@/types/ImageUploadModel'

export default function getImageUploadModel(file: File | null, removeImage: boolean = false): ImageUploadModel {
    const reader: FileReader = new FileReader()
    const imageUpload: ImageUploadModel = {
        image: null,
        filename: file ? file.name : null,
        removeImage: removeImage,
    }

    reader.onload = (event) => {
        imageUpload.image = event.target?.result?.toString()?.split(',')[1] || ''
    }

    if (file) {
        reader.readAsDataURL(file)
    }

    return imageUpload
}
