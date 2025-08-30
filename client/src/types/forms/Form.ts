import { Maybe } from "@/types/Maybe"

export interface Form {
    [key: string]: Maybe<string | number | readonly string[]>
}
