import { Instruction } from "@/types/api/Instruction"
import { LINEBREAK } from "@/types/constants/LINEBREAK"
import { StringBuilder } from "@/util/StringBuilder"

/**
 * Given an array of Instructions, e.g. as instructions property of a Recipe from the Recipe API,
 * returns a string of the instructions separated by a linebreak. The return value can be for
 * example used as defaultValue for a textarea field.
 *
 * @param instructions An array of instructions, e.g. received from the Recipe API.
 * @returns A list of all instructions, separated by linebreaks.
 */
export default function getInstructions(instructions: Instruction[]): string {
    return new StringBuilder()
        .forEach(instructions, (sb, instruction, i) => sb
            .append(instruction.instruction)
            .when(instructions.length !== i + 1)
            .append(LINEBREAK + LINEBREAK))
        .build()
}
