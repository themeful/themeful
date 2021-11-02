export const sortMap = <T>(
  data: { [key: string]: T },
  sortFN?: (a: [string, T], b: [string, T]) => number
): { [key: string]: T } => {
  return Object.entries(data)
    .sort(sortFN)
    .reduce((o, [k, v]) => ((o[k] = v), o), {})
}
