import * as systemFind from 'find'
import * as fs from 'fs'
import { findInSync } from './system.util'

describe('SystemUtils', () => {
  const term = '^\\$at[^;]+!default;$'

  beforeEach(async () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue(aliasTokensDefaults)
    jest
      .spyOn(systemFind, 'fileSync')
      .mockReturnValue([
        'sample/components/button/button.component.scss',
        'sample/components/card/card.component.scss',
      ])
  })
  describe('findInSync', () => {
    it('should return files', () => {
      expect(findInSync({ term, flags: 'gm' }, '/some/test/path', '.s[a|c]ss$')).toEqual(
        findInSyncResult
      )
    })

    it('should return files without filefilter', () => {
      expect(findInSync({ term, flags: 'gm' }, '/some/test/path', undefined)).toEqual(
        findInSyncResult
      )
    })

    it('should return files with string pattern', () => {
      expect(findInSync('^\\$at[^;]+!default;$', '/some/test/path', '.s[a|c]ss$')).toEqual(
        findInSyncResult
      )
    })
  })
})

const findInSyncResult = [
  {
    filename: 'sample/components/card/card.component.scss',
    lines: [
      '$atButtonBackground: #11f !default;',
      '$atButtonFontColor: #fff !default;',
      '$atButtonFontSize: 14px !default;',
      '$atButtonBackgroundHover: #88f !default;',
      '$atButtonVerticalSpace: 8px !default;',
      '$atButtonHorizontalSpace: 16px !default;',
      '$atButtonBorderRadius: 16px !default;',
      '$atButtonBorderColor: red !default;',
    ],
    matches: [
      '$atButtonBackground: #11f !default;',
      '$atButtonFontColor: #fff !default;',
      '$atButtonFontSize: 14px !default;',
      '$atButtonBackgroundHover: #88f !default;',
      '$atButtonVerticalSpace: 8px !default;',
      '$atButtonHorizontalSpace: 16px !default;',
      '$atButtonBorderRadius: 16px !default;',
      '$atButtonBorderColor: red !default;',
    ],
  },
  {
    filename: 'sample/components/button/button.component.scss',
    lines: [
      '$atButtonBackground: #11f !default;',
      '$atButtonFontColor: #fff !default;',
      '$atButtonFontSize: 14px !default;',
      '$atButtonBackgroundHover: #88f !default;',
      '$atButtonVerticalSpace: 8px !default;',
      '$atButtonHorizontalSpace: 16px !default;',
      '$atButtonBorderRadius: 16px !default;',
      '$atButtonBorderColor: red !default;',
    ],
    matches: [
      '$atButtonBackground: #11f !default;',
      '$atButtonFontColor: #fff !default;',
      '$atButtonFontSize: 14px !default;',
      '$atButtonBackgroundHover: #88f !default;',
      '$atButtonVerticalSpace: 8px !default;',
      '$atButtonHorizontalSpace: 16px !default;',
      '$atButtonBorderRadius: 16px !default;',
      '$atButtonBorderColor: red !default;',
    ],
  },
]

const aliasTokensDefaults = `$atButtonBackground: #11f !default;
$atButtonFontColor: #fff !default;
$atButtonFontSize: 14px !default;
$atButtonBackgroundHover: #88f !default;
$atButtonVerticalSpace: 8px !default;
$atButtonHorizontalSpace: 16px !default;
$atButtonBorderRadius: 16px !default;
$atButtonBorderColor: red !default;
`
