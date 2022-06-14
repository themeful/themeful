import { clone } from '@utils'
import * as fs from 'fs'
import {
  designTokens as designTokensJson,
  styleGuides as styleGuidesJson,
  themes as themesJson,
} from '../services/samples'
import { themesScss } from './themes-scss.generator'

describe('themesScss', () => {
  const generator = themesScss
  const themes = clone(themesJson)
  const styleGuides = clone(styleGuidesJson)
  const designTokens = clone(designTokensJson)
  const testPath = '/test/path/'

  beforeEach(async () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementation()
    jest.spyOn(fs, 'unlinkSync').mockImplementation()
    jest
      .spyOn(fs, 'readdirSync')
      .mockReturnValue([
        'theme_styleGuide1_light.scss',
        'theme_styleGuide1_light.scss',
        'theme_styleGuide1_light.scss',
        'theme_styleGuide1_light.scss',
      ] as unknown as fs.Dirent[])
  })

  it('should be defined', () => {
    expect(generator).toBeDefined()
  })

  describe('generate themes.scss file', () => {
    it('should create full file', () => {
      generator(testPath, false, themes, designTokens, styleGuides)

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        1,
        `${testPath}theme_styleGuide1_light.scss`,
        `@import './styleGuides.scss';

body {
  font-size: 12px;
}

& {
  --dtTestActionBackground: #{$styleGuide1_brand_secondary};
  --dtTestFontColorPrimary: #{$global_base_black};
  --dtTestFontSize100: 12px;
  @include global_mediaQuery_aboveDesktop {
    --dtTestFontSize100: 13px;
  }
}
`
      )

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        2,
        `${testPath}theme_styleGuide1_dark.scss`,
        `@import './styleGuides.scss';

body {
  font-size: 12px;
}

& {
  --dtTestActionBackground: #{$styleGuide1_brand_secondary};
  --dtTestFontColorPrimary: #{$global_base_white};
  --dtTestFontSize100: #{$styleGuide1_fontSize_primary};
}
`
      )

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        3,
        `${testPath}theme_styleGuide2_light.scss`,
        `@import './styleGuides.scss';

& {
  --dtTestActionBackground: #{$styleGuide2_brand_primary};
  --dtTestFontColorPrimary: #{$global_base_black};
  --dtTestFontSize100: #{$styleGuide2_fontSize_normal};
}
`
      )

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        4,
        `${testPath}theme_styleGuide2_dark.scss`,
        `@import './styleGuides.scss';

& {
  --dtTestActionBackground: #{$styleGuide2_brand_secondary};
  --dtTestFontColorPrimary: #{$global_base_white};
  --dtTestFontSize100: #{$styleGuide2_fontSize_normal};
}
`
      )
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        5,
        `${testPath}themes.scss`,
        `html[data-brand-theme='styleGuide1_light'] {
  @import './theme_styleGuide1_light';
}
html[data-brand-theme='styleGuide1_dark'] {
  @import './theme_styleGuide1_dark';
}
html[data-brand-theme='styleGuide2_light'] {
  @import './theme_styleGuide2_light';
}
html[data-brand-theme='styleGuide2_dark'] {
  @import './theme_styleGuide2_dark';
}
`
      )
    })
  })

  describe('generate themes.scss file with missing data', () => {
    it('should create file missing styleGuide', () => {
      const removedStyleGuide = clone(styleGuides)
      delete removedStyleGuide['styleGuide1']

      generator(testPath, true, themes, designTokens, removedStyleGuide)

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        6,
        `${testPath}theme_styleGuide2_light.scss`,
        `@import './styleGuides.scss';

& {
  --d12: #{$styleGuide2_brand_primary};
  --d34: #{$global_base_black};
  --d56: #{$styleGuide2_fontSize_normal};
}
`
      )

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        7,
        `${testPath}theme_styleGuide2_dark.scss`,
        `@import './styleGuides.scss';

& {
  --d12: #{$styleGuide2_brand_secondary};
  --d34: #{$global_base_white};
  --d56: #{$styleGuide2_fontSize_normal};
}
`
      )
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        8,
        `${testPath}themes.scss`,
        `html[data-brand-theme='styleGuide2_light'] {
  @import './theme_styleGuide2_light';
}
html[data-brand-theme='styleGuide2_dark'] {
  @import './theme_styleGuide2_dark';
}
`
      )
    })
  })
})
