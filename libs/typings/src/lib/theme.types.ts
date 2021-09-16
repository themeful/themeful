export interface Themes {
  [themeSlug: string]: Theme
}

export interface Theme {
  name: string
  styleGuide: string
  styles: ThemeValues
}

export interface ThemeValues {
  [designToken: string]: ThemeValue
}

export interface ThemeValue {
  default: ValueDetail
  [media: string]: ValueDetail
}

export interface ValueDetail {
  style?: string
  directValue?: DirectValue
}

export interface DirectValue {
  value: string
  type: string
}
