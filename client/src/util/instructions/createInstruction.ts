import { Detached } from "@/types/api/Detached"
import { Instruction } from "@/types/api/Instruction"

export const createInstruction = (instruction: string): Detached<Instruction> => {
    return {
        "@type": "Instruction",
        instruction: instruction,
    }
}
