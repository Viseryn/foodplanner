import { Optional } from "@/types/Optional"

export interface Form {
    [key: string]: Optional<string | number | readonly string[]>
}
