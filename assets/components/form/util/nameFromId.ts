/***********************************************
 * ./assets/components/form/util/nameFromId.ts *
 ***********************************************/

/**
 * @param id The id of some form field.
 * @returns The name for the corresponding Symfony form field.
 * 
 * @example const name = nameFromId('user_group_name') // 'user_group[name]'
 */
export default function nameFromId(id: string): string {
    const index: number = id?.lastIndexOf('_')
    const prefix: string = id?.slice(0, index)
    const name: string = id?.slice(index + 1)
    
    return prefix + '[' + name + ']'
}
