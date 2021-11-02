import { Test, TestingModule } from '@nestjs/testing'
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
    jest.spyOn(jsonfile, 'readFileSync').mockReturnValue(clone(themes))
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

      withOneMore['test3_light'] = newTheme

      expect(service.create(clone(newTheme))).toEqual(newTheme)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './libs/components/design-system/themes.json',
        withOneMore,
        { spaces: 2 }
      )
    })

    it('should not create one', () => {
      expect(service.create(clone(themes).test1_dark)).toEqual(null)
    })
  })

  describe('update', () => {
    it('should update one', () => {
      const withOneUpdated = clone(themes)

      delete withOneUpdated['test2_dark']
      withOneUpdated['test2_red'] = updatedTheme

      expect(service.update('test2_dark', clone(updatedTheme))).toEqual(updatedTheme)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './libs/components/design-system/themes.json',
        withOneUpdated,
        { spaces: 2 }
      )
    })

    it('should not update with wrong key', () => {
      expect(service.update('test3_dark', clone(updatedTheme))).toEqual(null)
    })

    it('should not update if alreay exist', () => {
      expect(service.update('test2_dark', clone(themes).test1_dark)).toEqual(null)
    })
  })

  describe('delete', () => {
    it('should delete one', () => {
      const withOneLess = clone(themes)

      delete withOneLess['test1_dark']

      expect(service.delete('test1_dark')).toEqual(true)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './libs/components/design-system/themes.json',
        withOneLess,
        { spaces: 2 }
      )
    })

    it('should not delete one', () => {
      expect(service.delete('test1_darktest')).toEqual(false)
    })
  })

  describe('generated fs', () => {
    it('should generate ts and scss fs', () => {
      jest.spyOn(fs, 'writeFileSync').mockImplementation()
      const withOneLess = clone(themes)

      delete withOneLess['test1_dark']

      expect(service.delete('test1_dark')).toEqual(true)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './libs/components/design-system/themes.ts',
        `export const themes = [
  { name: 'Light', slug: 'test1_light' },
  { name: 'Dark', slug: 'test1_dark' },
  { name: 'Light', slug: 'test2_light' },
  { name: 'Dark', slug: 'test2_dark' },
]
`
      )
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './libs/components/src/assets/generated/theme_test1_light.scss',
        `@import './styleGuides.scss';

& {
  --dtActionBG: #{$test1_brand_secondary};
  --dtFontColorPrimary: #{$global_base_black};
  --dtFontSize100: #{$test1_fontSize_primary};
}
`
      )
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './libs/components/src/assets/generated/theme_test1_dark.scss',
        `@import './styleGuides.scss';

& {
  --dtActionBG: #{$test1_brand_secondary};
  --dtFontColorPrimary: #{$global_base_white};
  --dtFontSize100: #{$test1_fontSize_primary};
}
`
      )
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './libs/components/src/assets/generated/theme_test2_light.scss',
        `@import './styleGuides.scss';

& {
  --dtActionBG: #{$test2_brand_primary};
  --dtFontColorPrimary: #{$global_base_black};
  --dtFontSize100: #{$test2_fontSize_normal};
}
`
      )
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './libs/components/src/assets/generated/theme_test2_dark.scss',
        `@import './styleGuides.scss';

& {
  --dtActionBG: #{$test2_brand_secondary};
  --dtFontColorPrimary: #{$global_base_white};
  --dtFontSize100: #{$test2_fontSize_normal};
}
`
      )
    })
  })

  describe('sync', () => {
    it('should sync create clients', () => {
      jest.spyOn(syncService, 'styleGuideBases').mockImplementation()
      expect(service.create(clone(newTheme))).toEqual(newTheme)

      expect(syncService.styleGuideBases).toHaveBeenCalledWith({
        action: 'create',
        primary: 'test3',
        values: ['test1', 'test2', 'test3'],
      })
    })

    it('should sync update styleGuideBases', () => {
      jest.spyOn(syncService, 'styleGuideBases').mockImplementation()
      expect(service.update('test2_dark', clone(updatedClient))).toEqual(updatedClient)

      expect(syncService.styleGuideBases).toHaveBeenCalledWith({
        action: 'update',
        primary: 'test2',
        secondary: 'test3',
        values: ['test1', 'test2', 'test3'],
      })
    })

    it('should sync after delete 1 theme of a client', () => {
      jest.spyOn(syncService, 'styleGuideBases').mockImplementation()
      expect(service.delete('test2_dark')).toEqual(true)

      expect(syncService.styleGuideBases).toHaveBeenCalledWith({
        action: 'sync',
        primary: 'test2',
        values: ['test1', 'test2'],
      })
    })

    it('should delete after delete all themes of a client', () => {
      const onlyTest2 = clone(themes)
      delete onlyTest2['test1_light']
      delete onlyTest2['test1_dark']
      jest.spyOn(syncService, 'styleGuideBases').mockImplementation()
      expect(service.delete('test1_light')).toEqual(true)
      expect(service.delete('test1_dark')).toEqual(true)
      expect(service.read()).toEqual(onlyTest2)

      expect(syncService.styleGuideBases).toHaveBeenCalledWith({
        action: 'sync',
        primary: 'test1',
        values: ['test1', 'test2'],
      })

      expect(syncService.styleGuideBases).toHaveBeenLastCalledWith({
        action: 'delete',
        primary: 'test1',
        values: ['test2'],
      })
    })
  })

  describe('get styleGuide changes from sync', () => {
    it('should not change anything', () => {
      syncService.styleGuides({
        action: 'create',
        primary: 'test1_brandnew_secondary',
        values: [
          'test1_brand_secondary',
          'global_base_white',
          'test1_fontSize_primary',
          'test2_brand_primary',
          'global_base_black',
          'test2_fontSize_normal',
          'test2_brand_secondary',
          'test1_brandnew_secondary',
        ],
      })
      expect(service.read()).toEqual(clone(themes))
    })

    it('should update a client', () => {
      const withUpdatedClient = clone(themes)

      withUpdatedClient['test2_dark'].values['dtActionBG'] = 'test2_brandnew_secondary'

      syncService.styleGuides({
        action: 'update',
        primary: 'test2_brand_secondary',
        secondary: 'test2_brandnew_secondary',
        values: [
          'test1_brand_secondary',
          'global_base_white',
          'test1_fontSize_primary',
          'test2_brand_primary',
          'global_base_black',
          'test2_fontSize_normal',
          'test2_brandnew_secondary',
        ],
      })
      expect(service.read()).toEqual(withUpdatedClient)
    })

    it('should delete a client', () => {
      const deletedClient = clone(themes)

      deletedClient['test1_dark'].values['dtFontColorPrimary'] = null
      deletedClient['test2_dark'].values['dtFontColorPrimary'] = null

      syncService.styleGuides({
        action: 'delete',
        primary: 'global_base_white',
        values: [
          'test1_brand_secondary',
          'test1_fontSize_primary',
          'test2_brand_primary',
          'global_base_black',
          'test2_fontSize_normal',
          'test2_brand_secondary',
        ],
      })
      expect(service.read()).toEqual(deletedClient)
    })
  })
})

const newTheme = {
  name: 'Light',
  slug: 'light',
  client: 'test3',
  values: {
    dtActionBG: 'test3_brand_secondary',
    dtFontColorPrimary: 'global_base_black',
    dtFontSize100: 'test3_fontSize_primary',
  },
}

const updatedTheme = {
  name: 'Red',
  slug: 'red',
  client: 'test2',
  values: {
    dtActionBG: 'test2_brand_primary',
    dtFontColorPrimary: 'global_base_black',
    dtFontSize100: 'test2_fontSize_medium',
  },
}

const updatedClient = {
  name: 'Red',
  slug: 'red',
  client: 'test3',
  values: {
    dtActionBG: 'test2_brand_primary',
    dtFontColorPrimary: 'global_base_black',
    dtFontSize100: 'test2_fontSize_medium',
  },
}

const themes = {
  test1_light: {
    name: 'Light',
    slug: 'light',
    values: {
      dtActionBG: 'test1_brand_secondary',
      dtFontColorPrimary: 'global_base_black',
      dtFontSize100: 'test1_fontSize_primary',
    },
  },
  test1_dark: {
    name: 'Dark',
    slug: 'dark',
    values: {
      dtActionBG: 'test1_brand_secondary',
      dtFontColorPrimary: 'global_base_white',
      dtFontSize100: 'test1_fontSize_primary',
    },
  },
  test2_light: {
    name: 'Light',
    slug: 'light',
    values: {
      dtActionBG: 'test2_brand_primary',
      dtFontColorPrimary: 'global_base_black',
      dtFontSize100: 'test2_fontSize_normal',
    },
  },
  test2_dark: {
    name: 'Dark',
    slug: 'dark',
    values: {
      dtActionBG: 'test2_brand_secondary',
      dtFontColorPrimary: 'global_base_white',
      dtFontSize100: 'test2_fontSize_normal',
    },
  },
}
