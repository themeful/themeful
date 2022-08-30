import { PropertyType } from '@typings'
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

const properties: { [key: string]: PropertyType } = {
  color: color,
  font: font,
  'font-size': fontSize,
  'font-weight': fontWeight,
  'font-family': fontFamily,
  mediaquery: mediaquery,
  display: display,
  size: size,
}

export const getProperty = (property: string | undefined): PropertyType => {
  if (property === undefined) {
    return empty
  }
  return properties[property] ?? fallback
}

export const propertyTypes = Object.keys(properties)

export const propertySelect = Object.entries(properties).map(([key, { name }]) => ({
  key,
  value: name,
}))
