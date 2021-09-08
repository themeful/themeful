import ShortUniqueId from 'short-unique-id'

const frist = new ShortUniqueId({ dictionary: 'alpha', length: 1 })
const rest = new ShortUniqueId({ length: 2 })

export const uuid = (): string => {
  return frist() + rest()
}
