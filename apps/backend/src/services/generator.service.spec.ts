import { Test, TestingModule } from '@nestjs/testing'
import { clone } from '@utils'
import * as generators from '../generators'
import { GeneratorService } from './generator.service'
import { aliasTokens, designTokens, styleGuides, themes } from './samples.mock'

describe('GeneratorService', () => {
  let service: GeneratorService
  const path = '/test/path'
  const themesJson = clone(themes)
  const designTokensJson = clone(designTokens)
  const aliasTokensJson = clone(aliasTokens)

  beforeEach(async () => {
    jest.spyOn(generators, 'designTokensScss').mockImplementation()
    jest.spyOn(generators, 'styleGuidesScss').mockImplementation()
    jest.spyOn(generators, 'themesScss').mockImplementation()
    jest.spyOn(generators, 'themesTs').mockImplementation()

    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratorService],
    }).compile()

    service = module.get<GeneratorService>(GeneratorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should execute themesTs generator', () => {
    service.themesTs(path, themesJson, styleGuides)
    expect(generators.themesTs).toBeCalledWith(path, themesJson, styleGuides)
  })

  it('should execute themesScss generator', () => {
    service.themesScss(path, false, themesJson, designTokensJson, styleGuides)
    expect(generators.themesScss).toBeCalledWith(
      path,
      false,
      themesJson,
      designTokensJson,
      styleGuides
    )
  })

  it('should execute styleGuidesScss generator', () => {
    service.styleGuidesScss(path, styleGuides)
    expect(generators.styleGuidesScss).toBeCalledWith(path, styleGuides)
  })

  it('should execute designTokensScss generator', () => {
    service.designTokensScss(path, false, themesJson, designTokensJson, aliasTokensJson)
    expect(generators.designTokensScss).toBeCalledWith(
      path,
      false,
      themesJson,
      designTokensJson,
      aliasTokensJson
    )
  })
})
