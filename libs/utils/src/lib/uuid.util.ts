import ShortUniqueId from 'short-unique-id'

const frist = new ShortUniqueId({ dictionary: 'alpha', length: 1 })
const short = new ShortUniqueId({ length: 2 })
const long = new ShortUniqueId({ length: 5 })

export const uuid = (): string => {
  return frist() + short()
}

export const longUuid = (): string => {
  return frist() + long()
}
