import { Detached } from "@/types/api/Detached"
import { Image } from "@/types/api/Image"
import { Nullish } from "@/types/Nullish"

export type Base64Image = Detached<Image> & {
    imageContents: Nullish<string>
}
