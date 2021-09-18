export interface StyleGuideBase {
  name: string
  baseFontSize: number
}

export interface StyleGuides {
  global: StyleGuide
  [styleGuideSlug: string]: StyleGuide
}

export interface StyleGuide extends StyleGuideBase {
  styles: { [styleSlug: string]: Style }
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

export interface StyleTypeGroup {
  name: string
  groups: StyleGroup[]
}

export interface ExtendedStyleGuide extends StyleGuideBase {
  slug: string
  types: StyleTypeGroup[]
}

export type ExtendedStyleGuides = ExtendedStyleGuide[]
