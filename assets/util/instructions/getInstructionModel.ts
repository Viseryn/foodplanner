import InstructionModel from '@/types/InstructionModel'

export default function getInstructionModel(instruction: string): InstructionModel {
    return {
        id: -1,
        instruction: instruction,
    }
}
