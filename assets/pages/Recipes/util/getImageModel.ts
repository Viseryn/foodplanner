import ImageModel from '@/types/ImageModel'
import { getBase64 } from '@/pages/Recipes/util/getBase64'

export const getImageModel = async (file: File | null, removeImage: boolean = false): Promise<ImageModel> => {
    return {
        id: -1,
        imageContents: file ? await getBase64(file) : null,
        filename: file?.name,
        removeImage: removeImage,
        directory: '/img/recipes/',
        public: true,
    }
}
