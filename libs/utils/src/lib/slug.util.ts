import { camelCase, camelCaseTransformMerge } from 'camel-case'

export const slugify = (input: string[]): string => {
  return input.map((part) => camelCase(part, { transform: camelCaseTransformMerge })).join('_')
}
