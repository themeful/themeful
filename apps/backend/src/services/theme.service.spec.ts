import { Test, TestingModule } from '@nestjs/testing'
import { StyleGuides, Theme, Themes } from '@typings'
import { clone } from '@utils'
import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
import { ConfigService } from './config.service'
import { SyncService } from './sync.service'
import { ThemeService } from './theme.service'

describe('ThemeService', () => {
  let service: ThemeService
  let syncService: SyncService

  beforeEach(async () => {
    syncService = new SyncService()
    jest.spyOn(fs, 'writeFileSync').mockImplementation()
    jest.spyOn(fs, 'unlinkSync').mockImplementation()
    jest.spyOn(jsonfile, 'readFileSync').mockImplementation((filename: string) => {
      if (filename.includes('theme')) {
        return clone(themes)
      } else if (filename.includes('styleGuides')) {
        return clone(styleGuides)
      }
    })
    jest.spyOn(jsonfile, 'writeFileSync').mockImplementation()

    const module: TestingModule = await Test.createTestingModule({
      providers: [ThemeService, ConfigService, { provide: SyncService, useValue: syncService }],
    }).compile()

    service = module.get<ThemeService>(ThemeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('read', () => {
    it('should return all', () => {
      expect(service.read()).toEqual(themes)
    })
  })

  describe('create', () => {
    it('should create one', () => {
      const withOneMore = clone(themes)

      withOneMore['styleGuide3_light'] = newTheme

      expect(service.create(clone(newTheme))).toEqual(true)
      expect(jsonfile.writeFileSync).toBeCalledWith('./sample/generated/themes.json', withOneMore, {
        spaces: 2,
      })
    })

    it('should not create one', () => {
      expect(service.create(clone(themes).styleGuide1_dark)).toEqual(false)
    })
  })

  describe('update', () => {
    it('should update one', () => {
      const withOneUpdated = clone(themes)

      delete withOneUpdated['styleGuide2_dark']
      withOneUpdated['styleGuide2_red'] = updatedTheme

      expect(service.update('styleGuide2_dark', clone(updatedTheme))).toEqual(true)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './sample/generated/themes.json',
        withOneUpdated,
        { spaces: 2 }
      )
    })

    it('should not update with wrong key', () => {
      expect(service.update('styleGuide3_dark', clone(updatedTheme))).toEqual(false)
    })

    it('should not update if alreay exist', () => {
      expect(service.update('styleGuide2_dark', clone(themes).styleGuide1_dark)).toEqual(false)
    })
  })

  describe('delete', () => {
    it('should delete one', () => {
      const withOneLess = clone(themes)

      delete withOneLess['styleGuide1_dark']

      expect(service.delete('styleGuide1_dark')).toEqual(true)
      expect(jsonfile.writeFileSync).toBeCalledWith('./sample/generated/themes.json', withOneLess, {
        spaces: 2,
      })
    })

    it('should not delete one', () => {
      expect(service.delete('styleGuide1_darktest')).toEqual(false)
    })
  })

  describe('generated fs', () => {
    it('should generate ts and scss fs', () => {
      jest.spyOn(fs, 'writeFileSync').mockImplementation()
      const withOneLess = clone(themes)

      delete withOneLess['styleGuide1_dark']

      expect(service.delete('styleGuide1_dark')).toEqual(true)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './sample/generated/themes.ts',
        `export const themes = [
  { name: 'StyleGuide 1 - Dark', slug: 'styleGuide1_dark' },
  { name: 'StyleGuide 1 - Light', slug: 'styleGuide1_light' },
  { name: 'StyleGuide 2 - Dark', slug: 'styleGuide2_dark' },
  { name: 'StyleGuide 2 - Light', slug: 'styleGuide2_light' },
]
`
      )
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './sample/generated/theme_styleGuide1_light.scss',
        `@import './styleGuides.scss';

& {
  --dtActionBG: #{$styleGuide1_brand_secondary};
  --dtFontColorPrimary: #{$global_base_black};
  --dtFontSize100: #{$styleGuide1_fontSize_primary};
}
`
      )
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './sample/generated/theme_styleGuide1_dark.scss',
        `@import './styleGuides.scss';

& {
  --dtActionBG: #{$styleGuide1_brand_secondary};
  --dtFontColorPrimary: #{$global_base_white};
  --dtFontSize100: #{$styleGuide1_fontSize_primary};
}
`
      )
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './sample/generated/theme_styleGuide2_light.scss',
        `@import './styleGuides.scss';

& {
  --dtActionBG: #{$styleGuide2_brand_primary};
  --dtFontColorPrimary: #{$global_base_black};
  --dtFontSize100: #{$styleGuide2_fontSize_normal};
}
`
      )
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './sample/generated/theme_styleGuide2_dark.scss',
        `@import './styleGuides.scss';

& {
  --dtActionBG: #{$styleGuide2_brand_secondary};
  --dtFontColorPrimary: #{$global_base_white};
  --dtFontSize100: #{$styleGuide2_fontSize_normal};
}
`
      )
    })
  })

  describe('get styleGuide changes from sync', () => {
    it('should not change anything', () => {
      syncService.styleGuides({
        action: 'create',
        primary: 'styleGuide1_brandnew_secondary',
        values: [
          'styleGuide1_brand_secondary',
          'global_base_white',
          'styleGuide1_fontSize_primary',
          'styleGuide2_brand_primary',
          'global_base_black',
          'styleGuide2_fontSize_normal',
          'styleGuide2_brand_secondary',
          'styleGuide1_brandnew_secondary',
        ],
      })
      expect(service.read()).toEqual(clone(themes))
    })

    it('should update a client', () => {
      const withUpdatedClient = clone(themes)

      withUpdatedClient['styleGuide2_dark'].styles['dtActionBG'] = {
        default: {
          style: 'styleGuide2_brandnew_secondary',
        },
      }

      syncService.styleGuides({
        action: 'update',
        primary: 'styleGuide2_brand_secondary',
        secondary: 'styleGuide2_brandnew_secondary',
        values: [
          'styleGuide1_brand_secondary',
          'global_base_white',
          'styleGuide1_fontSize_primary',
          'styleGuide2_brand_primary',
          'global_base_black',
          'styleGuide2_fontSize_normal',
          'styleGuide2_brandnew_secondary',
        ],
      })
      expect(service.read()).toEqual(withUpdatedClient)
    })

    it('should delete a client', () => {
      const deletedClient = clone(themes)

      deletedClient['styleGuide1_dark'].styles['dtFontColorPrimary'] = {}
      deletedClient['styleGuide2_dark'].styles['dtFontColorPrimary'] = {}

      syncService.styleGuides({
        action: 'delete',
        primary: 'global_base_white',
        values: [
          'styleGuide1_brand_secondary',
          'styleGuide1_fontSize_primary',
          'styleGuide2_brand_primary',
          'global_base_black',
          'styleGuide2_fontSize_normal',
          'styleGuide2_brand_secondary',
        ],
      })
      expect(service.read()).toEqual(deletedClient)
    })
  })
})

const newTheme: Theme = {
  name: 'Light',
  styleGuide: 'styleGuide3',
  styles: {
    dtActionBG: {
      default: {
        style: 'styleGuide3_brand_secondary',
      },
    },
    dtFontColorPrimary: {
      default: {
        style: 'global_base_black',
      },
    },
    dtFontSize100: {
      default: {
        style: 'styleGuide3_fontSize_primary',
      },
    },
  },
}

const updatedTheme: Theme = {
  name: 'Red',
  styleGuide: 'styleGuide2',
  styles: {
    dtActionBG: {
      default: {
        style: 'styleGuide2_brand_primary',
      },
    },
    dtFontColorPrimary: {
      default: {
        style: 'global_base_black',
      },
    },
    dtFontSize100: {
      default: {
        style: 'styleGuide2_fontSize_medium',
      },
    },
  },
}

const themes: Themes = {
  styleGuide1_light: {
    name: 'Light',
    styleGuide: 'styleGuide1',
    styles: {
      dtActionBG: {
        default: {
          style: 'styleGuide1_brand_secondary',
        },
      },
      dtFontColorPrimary: {
        default: {
          style: 'global_base_black',
        },
      },
      dtFontSize100: {
        default: {
          style: 'styleGuide1_fontSize_primary',
        },
      },
    },
  },
  styleGuide1_dark: {
    name: 'Dark',
    styleGuide: 'styleGuide1',
    styles: {
      dtActionBG: {
        default: {
          style: 'styleGuide1_brand_secondary',
        },
      },
      dtFontColorPrimary: {
        default: {
          style: 'global_base_white',
        },
      },
      dtFontSize100: {
        default: {
          style: 'styleGuide1_fontSize_primary',
        },
      },
    },
  },
  styleGuide2_light: {
    name: 'Light',
    styleGuide: 'styleGuide2',
    styles: {
      dtActionBG: {
        default: {
          style: 'styleGuide2_brand_primary',
        },
      },
      dtFontColorPrimary: {
        default: {
          style: 'global_base_black',
        },
      },
      dtFontSize100: {
        default: {
          style: 'styleGuide2_fontSize_normal',
        },
      },
    },
  },
  styleGuide2_dark: {
    name: 'Dark',
    styleGuide: 'styleGuide2',
    styles: {
      dtActionBG: {
        default: {
          style: 'styleGuide2_brand_secondary',
        },
      },
      dtFontColorPrimary: {
        default: {
          style: 'global_base_white',
        },
      },
      dtFontSize100: {
        default: {
          style: 'styleGuide2_fontSize_normal',
        },
      },
    },
  },
}

const styleGuides: StyleGuides = {
  global: {
    name: 'Global',
    baseFontSize: 16,
    styles: {
      base_black: {
        name: 'Black',
        type: 'color',
        group: 'base',
        value: '#333333',
      },
      base_light: {
        name: 'Light',
        type: 'color',
        group: 'base',
        value: '#ffffff',
      },
      gray_100: {
        name: '100',
        type: 'color',
        group: 'gray',
        value: 'rgba(0, 0, 0, 0.75)',
      },
      gray_200: {
        name: '200',
        type: 'color',
        group: 'gray',
        value: 'rgba(0, 0, 0, 0.60)',
      },
      gray_300: {
        name: '300',
        type: 'color',
        group: 'gray',
        value: 'rgba(0, 0, 0, 0.45)',
      },
      gray_400: {
        name: '400',
        type: 'color',
        group: 'gray',
        value: 'rgba(0, 0, 0, 0.30)',
      },
      gray_500: {
        name: '500',
        type: 'color',
        group: 'gray',
        value: 'rgba(0, 0, 0, 0.15)',
      },
      space_tiny: {
        type: 'size',
        group: 'space',
        name: 'Tiny',
        value: '4px',
      },
      space_small: {
        type: 'size',
        group: 'space',
        name: 'Small',
        value: '8px',
      },
      space_smallMedium: {
        name: 'Small Medium',
        type: 'size',
        group: 'space',
        value: '0.75rem',
      },
      space_medium: {
        type: 'size',
        group: 'space',
        name: 'Medium',
        value: '16px',
      },
      space_large: {
        type: 'size',
        group: 'space',
        name: 'Large',
        value: '24px',
      },
      space_xlarge: {
        type: 'size',
        group: 'space',
        name: 'X-Large',
        value: '32px',
      },
      mediaQuery_aboveSmallMobile: {
        name: 'Above Small Mobile',
        type: 'mediaquery',
        group: 'mediaQuery',
        value: 'screen and (min-width: 321px)',
      },
      mediaQuery_aboveMobile: {
        name: 'Above Mobile',
        type: 'mediaquery',
        group: 'mediaQuery',
        value: 'screen and (min-width: 664px)',
      },
      mediaQuery_aboveTablet: {
        name: 'Above Tablet',
        type: 'mediaquery',
        group: 'mediaQuery',
        value: 'screen and (min-width: 992px)',
      },
      mediaQuery_aboveDesktop: {
        name: 'Above Desktop',
        type: 'mediaquery',
        group: 'mediaQuery',
        value: 'screen and (min-width: 1200px)',
      },
    },
  },
  styleGuide1: {
    name: 'StyleGuide 1',
    baseFontSize: 16,
    styles: {
      action_primary: {
        name: 'Primary',
        type: 'color',
        group: 'action',
        value: '#31ed31',
      },
      action_secondary: {
        name: 'Secondary',
        type: 'color',
        group: 'action',
        value: '#2ec22e',
      },
      action_tertiary: {
        name: 'Tertiary',
        type: 'color',
        group: 'action',
        value: '#1e961e',
      },
      brand_primary: {
        type: 'color',
        group: 'brand',
        name: 'Primary',
        value: '#ff0000',
      },
      brand_secondary: {
        name: 'Secondary',
        type: 'color',
        group: 'brand',
        value: '#d42828',
      },
      brand_tertiary: {
        name: 'Tertiary',
        type: 'color',
        group: 'brand',
        value: '#af2323',
      },
      font_primary: {
        name: 'Primary',
        type: 'font',
        group: 'font',
        value: 'Verdana, Geneva, Tahoma, sans-serif',
      },
      content_primary: {
        type: 'font-size',
        group: 'content',
        name: 'Primary',
        value: '1.2rem',
      },
      mediaQuery_aboveSmallDesktop: {
        name: 'Above Desktop',
        type: 'mediaquery',
        group: 'mediaQuery',
        value: 'screen and (min-width: 1100px)',
      },
    },
  },
  styleGuide2: {
    name: 'StyleGuide 2',
    baseFontSize: 16,
    styles: {
      action_primary: {
        name: 'Primary',
        type: 'color',
        group: 'action',
        value: '#ff5555',
      },
      action_secondary: {
        name: 'Secondary',
        type: 'color',
        group: 'action',
        value: '#d22828',
      },
      action_tertiary: {
        name: 'Tertiary',
        type: 'color',
        group: 'action',
        value: '#9f1c1c',
      },
      brand_primary: {
        name: 'Primary',
        type: 'color',
        group: 'brand',
        value: '#577bf1',
      },
      brand_secondary: {
        name: 'Secondary',
        type: 'color',
        group: 'brand',
        value: '#4646ed',
      },
      brand_tertiary: {
        name: 'Tertiary',
        type: 'color',
        group: 'brand',
        value: '#3f55b1',
      },
      font_primary: {
        name: 'Primary',
        type: 'font',
        group: 'font',
        value: "'Times New Roman', Times, serif",
      },
      content_normal: {
        type: 'font-size',
        group: 'content',
        name: 'Normal',
        value: '0.9rem',
      },
    },
  },
  styleGuide3: {
    name: 'StyleGuide 3',
    baseFontSize: 10,
    styles: {
      base_primary: {
        name: 'Primary',
        type: 'color',
        group: 'base',
        value: '#2be053',
      },
    },
  },
}
