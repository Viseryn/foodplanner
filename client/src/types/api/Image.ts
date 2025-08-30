import { ApiResource } from "@/types/api/ApiResource"

/**
 * This type mirrors the ApiResource `Image`.
 *
 * @see api/src/Entity/Image.php
 */
export type Image = ApiResource & {
    "@type": "Image"
    id: number
    filename: string
    directory: string
    public: boolean
}
