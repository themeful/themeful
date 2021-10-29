export interface StyleGuideBase {
  name: string
  baseFontSize: number
}

export interface StyleGuides {
  global: StyleGuide
  [styleGuideSlug: string]: StyleGuide
}

export interface StyleGuide extends StyleGuideBase {
  styles: StyleMap
}

export interface FormatedStyleGuide extends StyleGuideBase {
  slug: string
  types: TypeGroupStyles[]
}

export interface Style {
  type: string
  group: string
  name: string
  value: string
}

export interface ExtendedStyle {
  type: string
  value: string
  slug?: string
  name?: string
  group?: string
  global?: boolean
}

export interface StyleGroup {
  name: string
  styles: ExtendedStyle[]
}

// export interface StyleMap {
//   [key: string]: Style
// }

export interface StyleTypeGroup {
  name: string
  groups: StyleGroup[]
}

export interface ExtendedStyleGuide extends StyleGuideBase {
  slug: string
  types: StyleTypeGroup[]
}

export type ExtendedStyleGuides = ExtendedStyleGuide[]

export interface StyleMap {
  [slug: string]: ExtendedStyle
}

export interface StylesMap {
  [slug: string]: ExtendedStyle[]
}

export interface GroupStyles {
  name: string
  styles: ExtendedStyle[]
}

export interface TypeGroupStyles {
  name: string
  groups: GroupStyles[]
}

export interface Dt2At {
  [designToken: string]: string[]
}
