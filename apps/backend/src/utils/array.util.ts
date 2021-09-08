export function unique<T>(a: T[]): T[] {
  return [...new Set(a)]
}
