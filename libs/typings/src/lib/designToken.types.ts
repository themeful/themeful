export interface DesignTokens {
  [token: string]: DesignToken
}

export interface DesignToken {
  type: string
  name: string
  group: string
  description: string
  properties: string[]
  aliasTokens: string[]
  short: string
}

export interface DesignTokenAPI extends DesignToken {
  token: string
}
