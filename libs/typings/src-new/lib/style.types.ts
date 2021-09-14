export interface StyleBase {
  name: string
  baseFontSize: number
  slug: string
}

export interface StyleGuides {
  global: StyleGuide
  [styleGuideSlug: string]: StyleGuide
}

export interface StyleGuide extends StyleBase {
  styles: { [styleSlug: string]: Style }
}

export interface Style {
  type: string
  group: string
  name: string
  value: string
}
