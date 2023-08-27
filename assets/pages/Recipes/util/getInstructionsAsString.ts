import InstructionModel from '@/types/InstructionModel'

/**
 * Given an array of Instructions, e.g. as instructions property of a Recipe from the Recipe API,
 * returns a string of the instructions separated by a linebreak. The return value can be for
 * example used as defaultValue for a textarea field.
 *
 * @param arr An array of instructions, e.g. received from the Recipe API.
 * @returns A list of all instructions, separated by linebreaks.
 */
export default function getInstructions(arr: InstructionModel[]): string {
    let instructions: string = ''
    let l: number = arr?.length

    arr?.map((instruction, i) => {
        if (l == i + 1) {
            instructions += instruction.instruction
        } else {
            instructions += instruction.instruction + "\r\n\r\n"
        }
    })

    return instructions
}
