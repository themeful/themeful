import { camelCase, camelCaseTransformMerge } from 'camel-case'

export const slugify = (input: string[]): string => {
  return input.map((part) => camelCase(part, { transform: camelCaseTransformMerge })).join('_')
}

export const aliasToken2Words = (input: string): string => {
  if (input.indexOf(' ') !== -1) {
    return input
  }
  input = input.startsWith('at') ? input.substring(2) : input
  return deCamelCase(input)
}

export const deCamelCase = (input: string): string =>
  (input.split(/(\d+|(?=[A-Z]))/) as string[])
    .reduce((result: string[], part: string) => {
      if (part) {
        result.push(`${part.charAt(0).toUpperCase()}${part.substring(1)}` as string)
      }
      return result
    }, [])
    .join(' ')

export const anycase2Words = (input: string): string => deCamelCase(slugify([input]))
