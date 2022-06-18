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
            libPaths: ['./test-sample/first-lib/', './test-sample/second-lib/'],
          },
          global: {
            baseFontSize: 16,
            shortDesignTokens: false,
          },
        },
        { spaces: 2 }
      )
    }
    this.config = readJsonFile(this.configFile)
    this.config.paths = {
      generatedPath: this.normalize(this.config.paths.generatedPath),
      dataPath: this.normalize(this.config.paths.dataPath),
      themesPath: this.normalize(this.config.paths.themesPath),
      libPaths: this.normalizeList(this.config.paths.libPaths),
    }
  }

  public get generatedPath(): string {
    return this.config.paths.generatedPath
  }

  public get dataPath(): string {
    return this.config.paths.dataPath
  }

  public get themesPath(): string {
    return this.config.paths.themesPath
  }

  public get libPaths(): string[] {
    return this.config.paths.libPaths
  }

  public get shortDesignTokens(): boolean {
    return this.config.global.shortDesignTokens
  }

  public get baseFontSize(): number {
    return this.config.global.baseFontSize
  }

  private normalize(path: string): string {
    return path ? `${path}${path.endsWith('/') ? '' : '/'}` : ''
  }

  private normalizeList(paths: string | string[]): string[] {
    if (!paths) {
      return []
    }
    if (Array.isArray(paths)) {
      return paths.map(this.normalize)
    } else {
      return [this.normalize(paths)]
    }
  }
}
