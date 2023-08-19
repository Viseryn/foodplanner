/*********************************
 * ./assets/types/ModelOption.ts *
 *********************************/

abstract class ModelOption<Model, OptionType> {
    entity: Model

    constructor(entity: Model) {
        this.entity = entity
    }

    abstract getOption(): OptionType
}

export default ModelOption;
