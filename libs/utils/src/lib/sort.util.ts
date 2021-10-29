export type SortItem = [string, unknown]

export const sortMap = <T>(data: T, sortFN?: (a: SortItem, b: SortItem) => number): T => {
  return Object.entries(data)
    .sort(sortFN)
    .reduce((o, [k, v]) => ((o[k] = v), o), {}) as T
}
