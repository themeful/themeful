export const sortMap = <T>(
  data: { [key: string]: T },
  sortFN?: (a: [string, T], b: [string, T]) => number
): { [key: string]: T } => {
  return Object.entries(data)
    .sort(
      sortFN
        ? sortFN
        : ([a], [b]): number => {
            return a > b ? 1 : -1
          }
    )
    .reduce((o: { [key: string]: T }, [k, v]) => ((o[k] = v), o), {})
}
