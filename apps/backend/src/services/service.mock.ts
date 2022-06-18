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
  baseFontSize: 16,
  shortDesignTokens: false,
})

export const mockFileService = {
  save: () => null,
  aliasTokens$: () => aliasTokens$,
  designTokens$: () => designTokens$,
  styleGuides$: () => styleGuides$,
  themes$: () => themes$,
} as unknown as FileService

export const mockConfigService = {
  generatedPath: './test-sample/generated/',
  dataPath: './test-sample/generated/',
  themesPath: './test-sample/generated/',
  libPaths: ['./test-sample/components/one-lib', './test-sample/components/other-lib'],
  shortDesignTokens: false,
  baseFontSize: 16,
}
