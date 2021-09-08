export interface AliasToken {
  token?: string
  extern: boolean
  crawled?: boolean
  files: string[] | null
  component: string[] | null
  properties: string[] | null
}

export interface AliasTokens {
  [key: string]: AliasToken
}
