import { AliasTokens, DesignTokens, GlobalConfig, StyleGuides, Themes } from '@typings'
import { ReplaySubject } from 'rxjs'
import { FileService } from './file.service'
import { aliasTokens, designTokens, styleGuides, themes } from './samples.mock'

const aliasTokens$ = new ReplaySubject<AliasTokens>(1)
const designTokens$ = new ReplaySubject<DesignTokens>(1)
const styleGuides$ = new ReplaySubject<StyleGuides>(1)
const themes$ = new ReplaySubject<Themes>(1)
const config$ = new ReplaySubject<GlobalConfig>(1)
aliasTokens$.next(aliasTokens)
designTokens$.next(designTokens)
styleGuides$.next(styleGuides)
themes$.next(themes)
config$.next({
  baseFontSize: '16px',
  shortDesignTokens: false,
})

export const mockFileService = {
  save: () => null,
  aliasTokens$: () => aliasTokens$,
  designTokens$: () => designTokens$,
  styleGuides$: () => styleGuides$,
  themes$: () => themes$,
  config$: () => config$,
  styleGuidesApi$: () => null,
} as unknown as FileService

export const mockConfigService = {
  generatedPath: './test-sample/generated/',
  dataPath: './test-sample/generated/',
  themesPath: './test-sample/generated/',
  libPath: './test-sample/components/',
  shortDesignTokens: false,
  baseFontSize: '16px',
}
