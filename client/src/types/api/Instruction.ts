import { ApiResource } from "@/types/api/ApiResource"

/**
 * This type mirrors the ApiResource `Instruction`.
 *
 * @see api/src/Entity/Instruction.php
 */
export type Instruction = ApiResource & {
    "@type": "Instruction"
    id: number
    instruction: string
}
