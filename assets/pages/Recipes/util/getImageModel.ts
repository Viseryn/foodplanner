import ImageModel from '@/types/ImageModel'

export default function getImageModel(file: File | null, removeImage: boolean = false): ImageModel {
    const reader: FileReader = new FileReader()
    const imageUpload: ImageModel = {
        id: -1,
        imageContents: null,
        filename: file ? file.name : null,
        removeImage: removeImage,
        directory: '/img/recipes/',
        public: true,
    }

    reader.onload = (event) => {
        imageUpload.imageContents = event.target?.result?.toString()?.split(',')[1] || ''
    }

    if (file) {
        reader.readAsDataURL(file)
    }

    return imageUpload
}
