export interface AliasTokens {
  [token: string]: AliasToken
}

export interface AliasToken {
  extern: boolean
  crawled: boolean
  files: string[] | null
  component: string[] | null
  properties: string[] | null
}
