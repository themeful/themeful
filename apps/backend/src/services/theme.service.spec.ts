import { Test, TestingModule } from '@nestjs/testing'
import { Theme } from '@typings'
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

  beforeEach(async () => {
    syncService = new SyncService()

    jest.spyOn(mockFileService, 'save')
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
    // it('should create one', () => {
    //   const withOneMore = clone(themes)

    //   withOneMore['styleGuide3_light'] = newTheme

    //   expect(service.create(clone(newTheme))).toEqual(true)
    //   expect(jsonfile.writeFileSync).toBeCalledWith('./sample/generated/themes.json', withOneMore, {
    //     spaces: 2,
    //   })
    // })

    it('should not create one', () => {
      expect(service.create(clone(themes).styleGuide1_dark)).toEqual(false)
    })
  })

  describe('update', () => {
    // it('should update one', () => {
    //   const withOneUpdated = clone(themes)

    //   delete withOneUpdated['styleGuide2_dark']
    //   withOneUpdated['styleGuide2_red'] = updatedTheme

    //   expect(service.update('styleGuide2_dark', clone(updatedTheme))).toEqual(true)
    //   expect(jsonfile.writeFileSync).toBeCalledWith(
    //     './sample/generated/themes.json',
    //     withOneUpdated,
    //     { spaces: 2 }
    //   )
    // })

    it('should not update with wrong key', () => {
      expect(service.update('styleGuide3_dark', clone(updatedTheme))).toEqual(false)
    })

    it('should not update if alreay exist', () => {
      expect(service.update('styleGuide2_dark', clone(themes).styleGuide1_dark)).toEqual(false)
    })
  })

  describe('delete', () => {
    // it('should delete one', () => {
    //   const withOneLess = clone(themes)

    //   delete withOneLess['styleGuide1_dark']

    //   expect(service.delete('styleGuide1_dark')).toEqual(true)
    //   expect(jsonfile.writeFileSync).toBeCalledWith('./sample/generated/themes.json', withOneLess, {
    //     spaces: 2,
    //   })
    // })

    it('should not delete one', () => {
      expect(service.delete('styleGuide1_darktest')).toEqual(false)
    })
  })

  //   describe('generated fs', () => {
  //     it('should generate ts and scss fs', () => {
  //       jest.spyOn(fs, 'writeFileSync').mockImplementation()
  //       const withOneLess = clone(themes)

  //       delete withOneLess['styleGuide1_dark']

  //       expect(service.delete('styleGuide1_dark')).toEqual(true)

  //       expect(fs.writeFileSync).toHaveBeenCalledWith(
  //         './sample/generated/themes.ts',
  //         `export const themes = [
  //   { name: 'StyleGuide 1 - Light', slug: 'styleGuide1_light' },
  //   { name: 'StyleGuide 1 - Dark', slug: 'styleGuide1_dark' },
  //   { name: 'StyleGuide 2 - Light', slug: 'styleGuide2_light' },
  //   { name: 'StyleGuide 2 - Dark', slug: 'styleGuide2_dark' },
  // ]
  // `
  //       )
  //       expect(fs.writeFileSync).toHaveBeenCalledWith(
  //         './sample/generated/theme_styleGuide1_light.scss',
  //         `@import './styleGuides.scss';

  // & {
  //   --dtActionBG: #{$styleGuide1_brand_secondary};
  //   --dtFontColorPrimary: #{$global_base_black};
  //   --dtFontSize100: #{$styleGuide1_fontSize_primary};
  // }
  // `
  //       )
  //       expect(fs.writeFileSync).toHaveBeenCalledWith(
  //         './sample/generated/theme_styleGuide1_dark.scss',
  //         `@import './styleGuides.scss';

  // & {
  //   --dtActionBG: #{$styleGuide1_brand_secondary};
  //   --dtFontColorPrimary: #{$global_base_white};
  //   --dtFontSize100: #{$styleGuide1_fontSize_primary};
  // }
  // `
  //       )
  //       expect(fs.writeFileSync).toHaveBeenCalledWith(
  //         './sample/generated/theme_styleGuide2_light.scss',
  //         `@import './styleGuides.scss';

  // & {
  //   --dtActionBG: #{$styleGuide2_brand_primary};
  //   --dtFontColorPrimary: #{$global_base_black};
  //   --dtFontSize100: #{$styleGuide2_fontSize_normal};
  // }
  // `
  //       )
  //       expect(fs.writeFileSync).toHaveBeenCalledWith(
  //         './sample/generated/theme_styleGuide2_dark.scss',
  //         `@import './styleGuides.scss';

  // & {
  //   --dtActionBG: #{$styleGuide2_brand_secondary};
  //   --dtFontColorPrimary: #{$global_base_white};
  //   --dtFontSize100: #{$styleGuide2_fontSize_normal};
  // }
  // `
  //       )
  //     })
  //   })

  describe('get styleGuide changes from sync', () => {
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
      })
    })

    // it('should delete a client', () => {
    //   const deletedClient = clone(themes)

    //   deletedClient['styleGuide1_dark'].styles['dtFontColorPrimary'] = {}
    //   deletedClient['styleGuide2_dark'].styles['dtFontColorPrimary'] = {}
    // })
  })
})

// const newTheme: Theme = {
//   name: 'Light',
//   styleGuide: 'styleGuide3',
//   styles: {
//     dtActionBG: {
//       default: {
//         style: 'styleGuide3_brand_secondary',
//       },
//     },
//     dtFontColorPrimary: {
//       default: {
//         style: 'global_base_black',
//       },
//     },
//     dtFontSize100: {
//       default: {
//         style: 'styleGuide3_fontSize_primary',
//       },
//     },
//   },
// }

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
