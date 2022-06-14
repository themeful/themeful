import { clone } from '@utils'
import * as fs from 'fs'
import {
  aliasTokens as aliasTokensJson,
  designTokens as designTokensJson,
  themes as themesJson,
} from '../services/samples'
import { designTokensScss } from './designTokens-scss.generator'

describe('designTokensScss', () => {
  const generator = designTokensScss
  const themes = clone(themesJson)
  const aliasTokens = clone(aliasTokensJson)
  const designTokens = clone(designTokensJson)
  const testPath = '/test/path/'

  beforeEach(async () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementation()
  })

  it('should be defined', () => {
    expect(generator).toBeDefined()
  })

  describe('generate designTokens.scss file', () => {
    it('should create full file', () => {
      generator(testPath, false, themes, designTokens, aliasTokens)

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        1,
        `${testPath}designTokens.scss`,
        `$atButtonBackground: var(--dtTestActionBackground);
$atBaseFontColor: var(--dtTestFontColorPrimary);
$atButtonFontColor: var(--dtTestFontColorPrimary);
$atButtonFontSize: var(--dtTestFontSize100);
`
      )
    })

    it('should create full file with short tokens', () => {
      generator(testPath, true, themes, designTokens, aliasTokens)

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        2,
        `${testPath}designTokens.scss`,
        `$atButtonBackground: var(--d12);
$atBaseFontColor: var(--d34);
$atButtonFontColor: var(--d34);
$atButtonFontSize: var(--d56);
`
      )
    })

    it('should create full file no default', () => {
      const themeNoDefault = clone(themesJson)
      themeNoDefault['styleGuide1_light'].styles['dtTestActionBackground'] = {
        global_mediaQuery_aboveDesktop: { style: 'styleGuide1_brand_secondary' },
      }
      delete themeNoDefault['styleGuide1_dark'].styles['dtTestFontSize100']

      const defaultAliasToken = clone(aliasTokensJson)
      defaultAliasToken['atButtonFontSize'] = {
        component: ['Button'],
        files: ['libs/components/src/lib/button/button.component.scss'],
        properties: ['font-size'],
        extern: false,
        crawled: true,
        default: '12px',
      }

      generator(testPath, false, themeNoDefault, designTokens, defaultAliasToken)
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        3,
        `${testPath}designTokens.scss`,
        `$atButtonBackground: var(--dtTestActionBackground);
$atBaseFontColor: var(--dtTestFontColorPrimary);
$atButtonFontColor: var(--dtTestFontColorPrimary);
$atButtonFontSize: var(--dtTestFontSize100, 12px);
`
      )
    })

    it('should create full file unused designToken with alias default', () => {
      const unusedDesignToken = clone(designTokensJson)

      unusedDesignToken['dtTestFontSize200'] = {
        type: 'font-size',
        name: 'Normal Font Size',
        group: 'content',
        description: 'Font size for normal text',
        properties: ['font-size'],
        aliasTokens: ['atButtonFontSize2'],
        short: 'd89',
      }

      const defaultAliasToken = clone(aliasTokensJson)
      defaultAliasToken['atButtonFontSize2'] = {
        component: ['Button'],
        files: ['libs/components/src/lib/button/button.component.scss'],
        properties: ['font-size'],
        extern: false,
        crawled: true,
        default: '12px',
      }

      generator(testPath, false, themes, unusedDesignToken, defaultAliasToken)

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        1,
        `${testPath}designTokens.scss`,
        `$atButtonBackground: var(--dtTestActionBackground);
$atBaseFontColor: var(--dtTestFontColorPrimary);
$atButtonFontColor: var(--dtTestFontColorPrimary);
$atButtonFontSize: var(--dtTestFontSize100);
`
      )
    })

    it('should create full file unused designToken', () => {
      const unusedDesignToken = clone(designTokensJson)

      unusedDesignToken['dtTestFontSize200'] = {
        type: 'font-size',
        name: 'Normal Font Size',
        group: 'content',
        description: 'Font size for normal text',
        properties: ['font-size'],
        aliasTokens: ['atButtonFontSize2'],
        short: 'd89',
      }

      generator(testPath, false, themes, unusedDesignToken, aliasTokens)

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        1,
        `${testPath}designTokens.scss`,
        `$atButtonBackground: var(--dtTestActionBackground);
$atBaseFontColor: var(--dtTestFontColorPrimary);
$atButtonFontColor: var(--dtTestFontColorPrimary);
$atButtonFontSize: var(--dtTestFontSize100);
`
      )
    })
  })
})
