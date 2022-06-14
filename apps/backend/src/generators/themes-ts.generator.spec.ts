import { clone } from '@utils'
import * as fs from 'fs'
import { styleGuides as styleGuidesJson, themes as themesJson } from '../services/samples.mock'
import { themesTs } from './themes-ts.generator'

describe('themesTs', () => {
  const generator = themesTs
  const themes = clone(themesJson)
  const styleGuides = clone(styleGuidesJson)
  const testPath = '/test/path/'

  beforeEach(async () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementation()
  })

  it('should be defined', () => {
    expect(generator).toBeDefined()
  })

  describe('generate themes.ts file', () => {
    it('should create full file', () => {
      generator(testPath, themes, styleGuides)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        `${testPath}themes.ts`,
        `export const themes = [
  { name: 'StyleGuide 1 - Light', slug: 'styleGuide1_light' },
  { name: 'StyleGuide 1 - Dark', slug: 'styleGuide1_dark' },
  { name: 'StyleGuide 2 - Light', slug: 'styleGuide2_light' },
  { name: 'StyleGuide 2 - Dark', slug: 'styleGuide2_dark' },
]
`
      )
    })

    it('should create file missing styleGuide', () => {
      const removedStyleGuide = clone(styleGuides)
      delete removedStyleGuide['styleGuide1']

      generator(testPath, themes, removedStyleGuide)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        `${testPath}themes.ts`,
        `export const themes = [
  { name: 'StyleGuide 2 - Light', slug: 'styleGuide2_light' },
  { name: 'StyleGuide 2 - Dark', slug: 'styleGuide2_dark' },
]
`
      )
    })
  })
})
