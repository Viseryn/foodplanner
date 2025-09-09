export const delay = (milliseconds: number): Promise<never> => new Promise(resolve => setTimeout(resolve, milliseconds))
