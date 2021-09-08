export interface Paths {
  generatedPath: string
  dataPath: string
  themesPath: string
  libPath: string
}

export interface Config {
  paths: Paths
  global: GlobalConfig
}

export interface GlobalConfig {
  baseFontSize: string
  shortDesignTokens: boolean
}
