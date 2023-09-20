type ImageModel = {
    /** The entity id of the File object. */
    id: number

    /** The filename of the File object. */
    filename?: string | null

    /** The directory of the File object. */
    directory: string

    /** Whether the File object is public. */
    public: boolean

    /** The base64 representation of the image */
    imageContents?: string | null

    /** Whether the image shall be removed */
    removeImage?: boolean
}

export default ImageModel
