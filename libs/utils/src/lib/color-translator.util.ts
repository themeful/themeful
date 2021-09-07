import { ColorTranslator } from 'colortranslator'

export function toHEX(color: string): string {
  return ColorTranslator.toHEX(color)
}

export function toRGBA(color: string): string {
  return ColorTranslator.toRGBA(color)
}
