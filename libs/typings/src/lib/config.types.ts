export interface Config {
  paths: Paths
  global: GlobalConfig
}

export interface Paths {
  generatedPath: string
  dataPath: string
  themesPath: string
  libPaths: string[]
}

export interface GlobalConfig {
  shortDesignTokens: boolean
  baseFontSize: number
}
