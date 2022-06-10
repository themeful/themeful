import { camelCase, camelCaseTransformMerge } from 'camel-case'

export const slugify = (input: string[]): string => {
  return input.map((part) => camelCase(part, { transform: camelCaseTransformMerge })).join('_')
}

export const camelCase2Words = (input: string): string => {
  const parts = []
  if (input.indexOf(' ') !== -1) {
    return input
  }
  input = input.startsWith('at') ? input.substring(2) : input
  input.split(/(\d+|(?=[A-Z]))/).forEach((part) => {
    parts.push(part.charAt(0).toUpperCase() + part.substring(1))
  })
  return parts.join(' ')
}
