import { getBase64 } from "@/pages/Recipes/util/getBase64"
import { Base64Image } from "@/types/Base64Image"

export const createRecipeImage = async (file: File): Promise<Base64Image> => {
    return {
        "@type": "Image",
        imageContents: await getBase64(file),
        filename: file.name,
        directory: "/img/recipes/",
        public: true,
    }
}
