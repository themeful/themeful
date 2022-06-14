import { clone } from '@utils'
import * as fs from 'fs'
import { styleGuides as styleGuidesJson } from '../services/samples.mock'
import { styleGuidesScss } from './styleGuides-scss.generator'

describe('styleGuidesScss', () => {
  const generator = styleGuidesScss
  const styleGuides = clone(styleGuidesJson)
  const testPath = '/test/path/'

  beforeEach(async () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementation()
  })

  it('should be defined', () => {
    expect(generator).toBeDefined()
  })

  describe('generate styleGuides.scss file', () => {
    it('should create file', () => {
      generator(testPath, styleGuides)

      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        1,
        `${testPath}styleGuides.scss`,
        `$global_base_black: #333333;
$global_base_light: #ffffff;
$styleGuide1_action_primary: #31ed31;
$styleGuide1_action_secondary: #2ec22e;
$styleGuide1_action_tertiary: #1e961e;
$styleGuide2_action_primary: #ff5555;
$styleGuide2_action_secondary: #d22828;
$styleGuide3_base_primary: #2be053;
@mixin global_mediaQuery_aboveDesktop {
  @media screen and (min-width: 1200px) {
    @content;
  }
}
@mixin global_mediaQuery_aboveSmallMobile {
  @media screen and (min-width: 321px) {
    @content;
  }
}
`
      )
    })
  })
})
