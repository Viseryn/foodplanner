/**************************************
 * ./assets/types/InstructionModel.ts *
 **************************************/

/**
 * Type specifications for Instruction objects returned by APIs
 */
type InstructionModel = {
    /** The entity id of the Instruction object. */
    id: number

    /** The text of the Instruction object. */
    instruction: string
}

export default InstructionModel
