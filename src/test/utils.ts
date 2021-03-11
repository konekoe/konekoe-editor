export const randInt = (min: number, max: number): number => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);

export const generateRandomString = (): string => Math.random().toString(36).slice(2);