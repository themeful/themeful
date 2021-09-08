export function clone<T>(a: T): T {
  return JSON.parse(JSON.stringify(a))
}
