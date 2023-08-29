type ImageUploadModel = {
    /** The base64 representation of the image */
    image?: string | null

    /** The original filename of the image */
    filename?: string | null

    /** Whether the image shall be removed */
    removeImage?: boolean
}

export default ImageUploadModel
