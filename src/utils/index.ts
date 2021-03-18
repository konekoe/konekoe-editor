export const generateUuid = (prefix: string): string => `${ (prefix) ? prefix + "-" : "" }${ Math.random().toString(36).slice(2) }`;