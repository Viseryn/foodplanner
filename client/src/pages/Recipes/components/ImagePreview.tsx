import { ReactElement } from "react"

export const ImagePreview = ({ url, alt }: {
    url: string,
    alt: string,
}): ReactElement => (
    <>
        <div className="text-sm font-semibold block mb-2">Bildvorschau</div>
        <img
            className="rounded-3xl h-[244px] max-h-[244px] w-full object-cover transition duration-300"
            src={url}
            alt={alt}
        />
    </>
)
