export interface Themes {
  [themeSlug: string]: Theme
}

export interface Theme {
  name: string
  site: string
  values: ThemeValues
}

export interface ThemeValues {
  [designToken: string]: ThemeValue
}

export interface ThemeValue {
  default: ValueDetail
  [media: string]: ValueDetail
}

export interface ValueDetail {
  baseValue?: string
  directValue?: DirectValue
}

export interface DirectValue {
  value: string
  type: string
}

// export type ThemeMedias = ThemeMedia[]

// export interface ThemeMedia {
//   media: string
//   name?: string
//   global?: boolean
//   baseValue?: SiteValue
//   directValue?: DirectValue
// }

// export interface ThemeValueForm {
//   medias: string[]
//   themeMedia?: ThemeMedia
//   token: string
//   type: string
//   baseValueTypes: {
//     key: string
//     name: string
//   }[]
//   theme: string
//   bvMap: { [key: string]: SiteValue }
// }
