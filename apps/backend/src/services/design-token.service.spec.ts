import { Test, TestingModule } from '@nestjs/testing'
import { DesignTokenAPI } from '@typings'
import { clone } from '@utils'
import * as utils from '@utils/uuid.util'
import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
import { ConfigService } from './config.service'
import { DesignTokenService } from './design-token.service'
import { FileService } from './file.service'
import { aliasTokens, designTokens, styleGuides, themes } from './samples'
import { SyncService } from './sync.service'

describe('DesignTokenService', () => {
  let service: DesignTokenService
  let syncService: SyncService
  // const utils = { uuid }

  beforeEach(async () => {
    syncService = new SyncService()
    jest.spyOn(fs, 'writeFileSync').mockImplementation()
    jest.spyOn(fs, 'unlinkSync').mockImplementation()
    jest.spyOn(jsonfile, 'writeFileSync').mockImplementation()
    jest.spyOn(jsonfile, 'readFileSync').mockImplementation((filename: string) => {
      if (filename.includes('themes')) {
        return clone(themes)
      } else if (filename.includes('designTokens')) {
        return clone(designTokens)
      } else if (filename.includes('aliasTokens')) {
        return clone(aliasTokens)
      } else if (filename.includes('styleGuides')) {
        return clone(styleGuides)
      } else if (filename.includes('themeful.json')) {
        return {
          paths: {
            generatedPath: './sample/generated/',
            dataPath: './sample/generated/',
            themesPath: './sample/generated/',
            libPath: './sample/components/',
          },
          global: {
            baseFontSize: '16px',
            shortDesignTokens: false,
          },
        }
      } else {
        return { some: 'object' }
      }
    })
    jest.spyOn(utils, 'uuid').mockReturnValue('test')

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DesignTokenService,
        FileService,
        {
          provide: ConfigService,
          useValue: {
            generatedPath: './sample/generated/',
            dataPath: './sample/generated/',
            themesPath: './sample/generated/',
            libPath: './sample/components/',
            shortDesignTokens: false,
          },
        },
        { provide: SyncService, useValue: syncService },
      ],
    }).compile()

    service = module.get<DesignTokenService>(DesignTokenService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('read', () => {
    it('should return all', () => {
      expect(service.read()).toEqual(designTokens)
    })
  })

  describe('create', () => {
    it('should create one', () => {
      const clonedDesignToken: DesignTokenAPI = clone(newDesignToken)
      delete clonedDesignToken.token
      clonedDesignToken.short = 'test'

      const withOneMore = clone(designTokens)
      withOneMore[newDesignToken.token] = clonedDesignToken

      const fileSave = jest.spyOn(FileService.prototype, 'save')

      expect(service.create(clone(newDesignToken))).toEqual(true)
      expect(fileSave).toBeCalledWith('designTokens', withOneMore)
    })

    it('should not create one', () => {
      const clonedDesignToken: DesignTokenAPI = {
        ...clone(designTokens.dtTestActionBackground),
        token: 'dtTestActionBackground',
      }
      expect(service.create(clonedDesignToken)).toEqual(false)
    })
  })

  describe('update', () => {
    it('should update one', () => {
      const clonedDesignToken: DesignTokenAPI = clone(updatedDesignToken)
      delete clonedDesignToken.token

      const withOneUpdated = clone(designTokens)

      delete withOneUpdated['dtTestFontColorPrimary']
      withOneUpdated[updatedDesignToken.token] = clonedDesignToken

      expect(service.update('dtTestFontColorPrimary', clone(updatedDesignToken))).toEqual(true)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './sample/generated/designTokens.json',
        withOneUpdated,
        { spaces: 2 }
      )
    })

    it('should not update one', () => {
      expect(service.update('dtTestWrongFontColorPrimary', clone(updatedDesignToken))).toEqual(
        false
      )
    })

    it('should not update to existing one', () => {
      const clonedDesignToken: DesignTokenAPI = {
        ...clone(designTokens.dtTestActionBackground),
        token: 'dtTestActionBackground',
      }
      expect(service.update('dtTestFontColorPrimary', clonedDesignToken)).toEqual(false)
    })
  })

  describe('delete', () => {
    it('should delete one', () => {
      const withOneLess = clone(designTokens)

      delete withOneLess['dtTestFontColorPrimary']

      expect(service.delete('dtTestFontColorPrimary')).toEqual(true)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './sample/generated/designTokens.json',
        withOneLess,
        { spaces: 2 }
      )
    })

    it('should not delete one', () => {
      expect(service.delete('dtTestFontColorTertiary')).toEqual(false)
    })
  })

  //   describe('generated files', () => {
  //     it('should generate scss files', () => {
  //       jest.spyOn(fs, 'writeFileSync').mockImplementation()
  //       const withOneLess = clone(designTokens)

  //       delete withOneLess['dtTestFontColorPrimary']

  //       expect(service.delete('dtTestFontColorPrimary')).toEqual(true)

  //       expect(fs.writeFileSync).toHaveBeenCalledWith(
  //         './sample/generated/designTokens.scss',
  //         `$atButtonBackground: var(--dtTestActionBackground);
  // $atBaseFontColor: var(--dtTestFontColorPrimary);
  // $atButtonFontColor: var(--dtTestFontColorPrimary);
  // $atButtonFontSize: var(--dtTestFontSize100);
  // `
  //       )
  //     })
  //   })

  describe('sync', () => {
    it('should sync create designTokens', () => {
      jest.spyOn(syncService, 'designTokens').mockImplementation()

      expect(service.create(clone(newDesignToken))).toEqual(true)

      expect(syncService.designTokens).toHaveBeenCalledWith({
        action: 'create',
        primary: 'dtActionBackgroundNew',
        values: [
          'dtActionBackgroundNew',
          'dtTestFontColorPrimary',
          'dtTestFontSize100',
          'dtTestActionBackground',
        ],
      })
    })

    it('should sync update designTokens', () => {
      jest.spyOn(syncService, 'designTokens').mockImplementation()

      expect(service.update('dtTestFontSize100', clone(updatedDesignToken))).toEqual(true)

      expect(syncService.designTokens).toHaveBeenCalledWith({
        action: 'update',
        primary: 'dtTestFontSize100',
        secondary: 'dtActionBackgroundUpdated',
        values: ['dtActionBackgroundUpdated', 'dtTestFontColorPrimary', 'dtTestActionBackground'],
      })
    })
    it('should sync delete designTokens', () => {
      jest.spyOn(syncService, 'designTokens').mockImplementation()
      expect(service.delete('dtTestFontSize100')).toEqual(true)

      expect(syncService.designTokens).toHaveBeenCalledWith({
        action: 'delete',
        primary: 'dtTestFontSize100',
        values: ['dtTestFontColorPrimary', 'dtTestActionBackground'],
      })
    })
  })

  describe('get changes from sync', () => {
    it('should create a aliasToken', () => {
      syncService.aliasTokens({
        action: 'create',
        primary: 'atnewButtonFontSize',
        values: [
          'atButtonBackground',
          'atBaseFontColor',
          'atButtonFontColor',
          'atButtonFontSize',
          'atnewButtonFontSize',
        ],
      })
      expect(service.read()).toEqual(designTokens)
    })

    it('should update a aliasToken', () => {
      const withUpdatedAliasToken = clone(designTokens)

      withUpdatedAliasToken.dtTestFontColorPrimary.aliasTokens = [
        'atButtonFontColor',
        'atNewBaseFontColor',
      ]

      syncService.aliasTokens({
        action: 'update',
        primary: 'atBaseFontColor',
        secondary: 'atNewBaseFontColor',
        values: [
          'atButtonBackground',
          'atBaseFontColor',
          'atButtonFontColor',
          'atButtonFontSize',
          'dtTestActionBackgroundUpdated',
        ],
      })
      expect(service.read()).toEqual(withUpdatedAliasToken)
    })

    it('should delete a aliasToken', () => {
      const deletedAliasToken = clone(designTokens)

      deletedAliasToken.dtTestFontColorPrimary.aliasTokens = ['atBaseFontColor']

      syncService.aliasTokens({
        action: 'delete',
        primary: 'atButtonFontColor',
        values: ['atButtonBackground', 'atBaseFontColor', 'atButtonFontSize'],
      })
      expect(service.read()).toEqual(deletedAliasToken)
    })
  })
})

const newDesignToken = {
  type: 'color',
  short: 'xyz',
  token: 'dtActionBackgroundNew',
  name: 'Action Background New',
  group: 'content',
  description: 'Background for action elements',
  properties: ['color', 'background-color'],
  aliasTokens: ['atButtonBackground'],
}

const updatedDesignToken = {
  type: 'color',
  token: 'dtActionBackgroundUpdated',
  name: 'Action Background Updated',
  group: 'content',
  short: 'gjG',
  description: 'Background for action elements',
  properties: ['color', 'background-color'],
  aliasTokens: ['atButtonBackground'],
}
