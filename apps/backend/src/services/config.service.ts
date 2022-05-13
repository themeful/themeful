import { Injectable } from '@nestjs/common'
import { Config } from '@typings'
import { existsSync } from 'fs'
import { readFileSync as readJsonFile, writeFileSync as writeJsonFile } from 'jsonfile'

@Injectable()
export class ConfigService {
  private config: Config
  private readonly configFile = 'themeful.json'

  constructor() {
    if (!existsSync(this.configFile)) {
      writeJsonFile(
        this.configFile,
        {
          paths: {
            generatedPath: './sample/generated/',
            dataPath: './sample/generated/',
            themesPath: './sample/generated/',
            libPath: './sample/components/',
          },
          global: {
            baseFontSize: '16px',
            shortDesignTokens: false,
          },
        },
        { spaces: 2 }
      )
    }
    this.config = readJsonFile(this.configFile)
  }

  public get generatedPath() {
    return this.config.paths.generatedPath
  }

  public get dataPath() {
    return this.config.paths.dataPath
  }

  public get themesPath() {
    return this.config.paths.themesPath
  }

  public get libPath() {
    return this.config.paths.libPath
  }

  public get shortDesignTokens() {
    return this.config.global.shortDesignTokens
  }
}
