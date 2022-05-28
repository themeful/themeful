import { color } from './color.property'
import { display } from './display.property'
import { empty } from './empty.property'
import { fallback } from './fallback.property'
import { fontFamily } from './font-family.property'
import { fontSize } from './font-size.property'
import { fontWeight } from './font-weight.property'
import { font } from './font.property'
import { mediaquery } from './mediaquery.property'
import { size } from './size.property'

const proeprties = {
  color: color,
  font: font,
  'font-size': fontSize,
  'font-weight': fontWeight,
  'font-family': fontFamily,
  mediaquery: mediaquery,
  display: display,
  size: size,
}

export const getProperty = (property: string | undefined) => {
  if (property === undefined) {
    return empty
  }
  return proeprties[property] ?? fallback
}

export const propertyTypes = Object.keys(proeprties)

export const propertySelect = Object.entries(proeprties).map(([key, { name }]) => ({
  key,
  value: name,
}))
