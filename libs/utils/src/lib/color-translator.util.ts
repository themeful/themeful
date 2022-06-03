import { Style } from '@typings'
import { ColorTranslator } from 'colortranslator'
import { slugify } from './slug.util'

export function toHEX(color: string): string {
  return ColorTranslator.toHEX(color)
}

export function toRGBA(color: string): string {
  return ColorTranslator.toRGBA(color)
}

export function unifyStyle(style: Style): Style {
  style.value.replace(';', '')
  if (style.type === 'color') {
    style.value = unifyColor(style.value)
  }
  style.group = slugify([style.group])
  return style
}

export function unifyColor(color: string): string {
  if (new ColorTranslator(color).A === 1) {
    return ColorTranslator.toHEX(color).toLowerCase()
  } else {
    return ColorTranslator.toRGBA(color).split(',').join(', ')
  }
}
