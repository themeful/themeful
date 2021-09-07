import { color } from './color.property'
import { display } from './display.property'
import { empty } from './empty.property'
import { fallback } from './fallback.property'
import { fontFamily } from './font-family.property'
import { fontSize } from './font-szie.property'
import { fontWeight } from './font-weight.property'
import { font } from './font.property'
import { mediaquery } from './mediaquery.property'
import { size } from './size.property'

const map = {
  font: font,
  color: color,
  'font-size': fontSize,
  'font-weight': fontWeight,
  'font-family': fontFamily,
  mediaquery: mediaquery,
  display: display,
  size: size,
}

export const properties = (property: string) => {
  if (!property) {
    return empty
  }
  return map[property] ?? fallback
}
