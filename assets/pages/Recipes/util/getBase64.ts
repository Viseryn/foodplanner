/**
 * Given a File object, returns a base64 representation of the file.
 */
export const getBase64 = async (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject): void => {
        const reader: FileReader = new FileReader()

        reader.onload = (event: ProgressEvent<FileReader>): void => {
            const imageContents: string = event.target?.result?.toString()?.split(',')[1] || ''
            resolve(imageContents)
        }

        reader.onerror = (error: ProgressEvent<FileReader>): void => {
            reject(error)
        }

        reader.readAsDataURL(file)
    })
}
