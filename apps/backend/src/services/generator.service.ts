import { Injectable } from '@nestjs/common'
import { AliasTokens, DesignTokens, StyleGuides, Themes } from '@typings'
import { designTokensScss, styleGuidesScss, themesScss, themesTs } from '../generators'

@Injectable()
export class GeneratorService {
  public themesTs(path: string, themes: Themes, styleGuides: StyleGuides): void {
    themesTs(path, themes, styleGuides)
  }

  public themesScss(
    path: string,
    shortDesignTokens: boolean,
    themes: Themes,
    designTokens: DesignTokens,
    styleGuides: StyleGuides
  ): void {
    themesScss(path, shortDesignTokens, themes, designTokens, styleGuides)
  }

  public styleGuidesScss(path: string, styleGuides: StyleGuides): void {
    styleGuidesScss(path, styleGuides)
  }

  public designTokensScss(
    path: string,
    shortDesignTokens: boolean,
    themes: Themes,
    designTokens: DesignTokens,
    aliasTokens: AliasTokens
  ): void {
    designTokensScss(path, shortDesignTokens, themes, designTokens, aliasTokens)
  }
}
