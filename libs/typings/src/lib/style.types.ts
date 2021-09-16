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
