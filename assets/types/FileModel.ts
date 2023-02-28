/*******************************
 * ./assets/types/FileModel.ts *
 *******************************/

/**
 * Type specifications for File objects returned by APIs
 */
type FileModel = {
    /** The entity id of the File object. */
    id: number

    /** The filename of the File object. */
    filename: string

    /** The directory of the File object. */
    directory: string

    /** Whether the File object is public. */
    public: boolean
}

export default FileModel
