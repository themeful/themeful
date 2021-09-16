import { Injectable } from '@nestjs/common'
import { Config } from '@typings'
import { config } from '../config'

@Injectable()
export class ConfigService {
  private config: Config

  constructor() {
    this.config = config
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
