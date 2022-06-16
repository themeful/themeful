import { Test, TestingModule } from '@nestjs/testing'
import { MediaValueDetail, Theme } from '@typings'
import { clone } from '@utils'
import { ConfigService } from './config.service'
import { FileService } from './file.service'
import { themes } from './samples.mock'
import { mockConfigService, mockFileService } from './service.mock'
import { SyncService } from './sync.service'
import { ThemeService } from './theme.service'

describe('ThemeService', () => {
  let service: ThemeService
  let syncService: SyncService
  const fileSave = jest.spyOn(mockFileService, 'save')

  beforeEach(async () => {
    syncService = new SyncService()

    jest.spyOn(mockFileService, 'aliasTokens$')
    jest.spyOn(mockFileService, 'designTokens$')
    jest.spyOn(mockFileService, 'styleGuides$')
    jest.spyOn(mockFileService, 'themes$')

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThemeService,
        { provide: FileService, useValue: mockFileService },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        { provide: SyncService, useValue: syncService },
      ],
    }).compile()

    service = module.get<ThemeService>(ThemeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create one', () => {
      const withOneMore = clone(themes)

      withOneMore['styleGuide3_light'] = newTheme

      expect(service.create(clone(newTheme))).toEqual(true)
      expect(fileSave).toBeCalledWith('themes', withOneMore)
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
      expect(fileSave).toBeCalledWith('themes', withOneUpdated)
    })

    it('should not update with wrong key', () => {
      expect(service.update('styleGuide3_dark', clone(updatedTheme))).toEqual(false)
    })

    it('should not update if alreay exist', () => {
      expect(service.update('styleGuide2_dark', clone(themes).styleGuide1_dark)).toEqual(false)
    })
  })

  describe('duplicate', () => {
    it('should duplicate one', () => {
      const withOneDuplicated = clone(themes)

      const duplicatedTheme = clone(withOneDuplicated['styleGuide2_dark'])
      duplicatedTheme.name = 'Red'
      withOneDuplicated['styleGuide2_red'] = duplicatedTheme

      expect(service.duplicate('styleGuide2_dark', { name: 'Red' })).toEqual(true)
      expect(fileSave).nthCalledWith(31, 'themes', withOneDuplicated)
    })

    it('should not duplicate with wrong key', () => {
      expect(service.duplicate('styleGuide5_dark', { name: 'Red' })).toEqual(false)
    })

    it('should not duplicate if alreay exist', () => {
      expect(service.duplicate('styleGuide2_dark', { name: 'Light' })).toEqual(false)
    })
  })

  describe('delete', () => {
    it('should delete one', () => {
      const withOneLess = clone(themes)

      delete withOneLess['styleGuide1_dark']

      expect(service.delete('styleGuide1_dark')).toEqual(true)
      expect(fileSave).toBeCalledWith('themes', withOneLess)
    })

    it('should not delete one', () => {
      expect(service.delete('styleGuide1_darktest')).toEqual(false)
    })
  })

  describe('createValue', () => {
    it('should one createValue', () => {
      const withOneValueMore = clone(themes)
      const themeName = 'styleGuide2_light'
      const designToken = 'dtTestFontColorPrimary'
      const themeValue = { media: 'mediaQuery', style: 'some_style_slug' } as MediaValueDetail
      withOneValueMore[themeName].styles[designToken][themeValue.media] = {
        style: themeValue.style,
      }

      expect(service.createValue(themeName, designToken, themeValue)).toEqual(true)
      expect(fileSave).toBeCalledWith('themes', withOneValueMore)
    })

    it('should one createValue with new DesignToken', () => {
      const withOneValueMore = clone(themes)
      const themeName = 'styleGuide2_light'
      const designToken = 'dtTestFontColorPrimary2'
      const themeValue = { media: 'mediaQuery', style: 'some_style_slug' } as MediaValueDetail
      withOneValueMore[themeName].styles[designToken] = {}
      withOneValueMore[themeName].styles[designToken][themeValue.media] = {
        style: themeValue.style,
      }

      expect(service.createValue(themeName, designToken, themeValue)).toEqual(true)
      expect(fileSave).toBeCalledWith('themes', withOneValueMore)
    })

    it('should not create Value', () => {
      expect(
        service.createValue('styleGuide2_notExist', 'dtTestFontColorPrimary', {
          media: 'mediaQuery',
          style: 'some_style_slug',
        })
      ).toEqual(false)
    })
  })

  describe('updateValue', () => {
    it('should one updateValue', () => {
      const withOneValueMore = clone(themes)
      const themeName = 'styleGuide2_light'
      const designToken = 'dtTestFontColorPrimary'
      const mediaQuery = 'default'
      const themeValue = { media: 'mediaQuery', style: 'some_style_slug' } as MediaValueDetail
      delete withOneValueMore[themeName].styles[designToken]['default']
      withOneValueMore[themeName].styles[designToken][themeValue.media] = {
        style: themeValue.style,
      }

      expect(service.updateValue(themeName, designToken, mediaQuery, themeValue)).toEqual(true)
      expect(fileSave).toBeCalledWith('themes', withOneValueMore)
    })

    it('should not update Value', () => {
      expect(
        service.updateValue('styleGuide2_notExist', 'dtTestFontColorPrimary', 'default', {
          media: 'mediaQuery',
          style: 'some_style_slug',
        })
      ).toEqual(false)
    })
  })

  describe('deleteValue', () => {
    it('should delete one Value', () => {
      const withOneValueMore = clone(themes)
      const themeName = 'styleGuide1_dark'
      const designToken = 'dtTestFontSize100'
      const mediaQuery = 'default'
      delete withOneValueMore[themeName].styles[designToken]['default']

      expect(service.deleteValue(themeName, designToken, mediaQuery)).toEqual(true)
      expect(fileSave).toBeCalledWith('themes', withOneValueMore)
    })

    it('should not delete Value', () => {
      expect(
        service.deleteValue('styleGuide2_notExist', 'dtTestFontColorPrimary', 'default')
      ).toEqual(false)
    })
  })

  // describe('get styleGuide changes from sync', () => {
  //   it('should update a styleGuide', () => {
  //     const withUpdatedStyleGuide = clone(themes)

  //     withUpdatedStyleGuide['styleGuide2_dark'].styles['dtActionBG'] = {
  //       default: {
  //         style: 'styleGuide2_brandnew_secondary',
  //       },
  //     }

  //     syncService.styleGuides({
  //       action: 'update',
  //       primary: 'styleGuide2_brand_secondary',
  //       secondary: 'styleGuide2_brandnew_secondary',
  //     })
  //     expect(fileSave).toBeCalledWith('designTokens', withUpdatedStyleGuide)
  //   })

  //   // it('should delete a styleGuide', () => {
  //   //   const deletedStyleGuide = clone(themes)

  //   //   deletedStyleGuide['styleGuide1_dark'].styles['dtFontColorPrimary'] = {}
  //   //   deletedStyleGuide['styleGuide2_dark'].styles['dtFontColorPrimary'] = {}
  //   // })
  // })
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
