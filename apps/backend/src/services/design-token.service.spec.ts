import { Test, TestingModule } from '@nestjs/testing'
import { DesignTokenAPI } from '@typings'
import { clone } from '@utils'
import * as utils from '@utils/uuid.util'
import { ConfigService } from './config.service'
import { DesignTokenService } from './design-token.service'
import { FileService } from './file.service'
import { designTokens } from './samples.mock'
import { mockConfigService, mockFileService } from './service.mock'
import { SyncService } from './sync.service'

describe('DesignTokenService', () => {
  let service: DesignTokenService
  let syncService: SyncService

  beforeEach(async () => {
    syncService = new SyncService()

    jest.spyOn(mockFileService, 'save')
    jest.spyOn(mockFileService, 'aliasTokens$')
    jest.spyOn(mockFileService, 'designTokens$')

    jest.spyOn(utils, 'uuid').mockReturnValue('test')

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DesignTokenService,
        { provide: FileService, useValue: mockFileService },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        { provide: SyncService, useValue: syncService },
      ],
    }).compile()

    service = module.get<DesignTokenService>(DesignTokenService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create one', () => {
      const clonedDesignToken: DesignTokenAPI = clone(newDesignToken)
      delete clonedDesignToken.token
      clonedDesignToken.short = 'test'

      const withOneMore = clone(designTokens)
      withOneMore[newDesignToken.token] = clonedDesignToken

      const fileSave = jest.spyOn(mockFileService, 'save')

      expect(service.create(clone(newDesignToken))).toEqual(true)
      expect(fileSave).toBeCalledWith('designTokens', withOneMore)
      fileSave.mockClear()
    })
    it('should create one missing some data', () => {
      const clonedDesignToken: DesignTokenAPI = clone(newDesignToken2)
      delete clonedDesignToken.token
      clonedDesignToken.short = 'test'
      clonedDesignToken.properties = []
      clonedDesignToken.aliasTokens = []

      const withOneMore = clone(designTokens)
      withOneMore[newDesignToken2.token] = clonedDesignToken

      const fileSave = jest.spyOn(mockFileService, 'save')

      expect(service.create(clone(newDesignToken2))).toEqual(true)
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

      const fileSave = jest.spyOn(mockFileService, 'save')

      expect(service.update('dtTestFontColorPrimary', clone(updatedDesignToken))).toEqual(true)
      expect(fileSave).toBeCalledWith('designTokens', withOneUpdated)
    })

    it('should update one missing some data', () => {
      const clonedDesignToken: DesignTokenAPI = clone(updatedDesignToken2)
      delete clonedDesignToken.token

      const withOneUpdated = clone(designTokens)

      const oldToken = withOneUpdated['dtTestFontColorPrimary']

      delete withOneUpdated['dtTestFontColorPrimary']
      withOneUpdated[updatedDesignToken2.token] = clonedDesignToken
      withOneUpdated[updatedDesignToken2.token].short = oldToken.short
      withOneUpdated[updatedDesignToken2.token].aliasTokens = oldToken.aliasTokens
      withOneUpdated[updatedDesignToken2.token].properties = oldToken.properties

      const fileSave = jest.spyOn(mockFileService, 'save')

      expect(service.update('dtTestFontColorPrimary', clone(updatedDesignToken2))).toEqual(true)
      expect(fileSave).nthCalledWith(7, 'designTokens', withOneUpdated)
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

  describe('split', () => {
    it('should split one', () => {
      const withSplitted = clone(designTokens)
      const newToken = {
        ...clone(withSplitted['dtTestFontColorPrimary']),
        aliasTokens: ['atTestBaseFontColor'],
        name: '--Splitted Token',
        short: 'test',
      }
      withSplitted['dtTestFontColorPrimary'].aliasTokens = ['atTestButtonFontColor']
      withSplitted['dtSplittedToken'] = newToken

      const fileSave = jest.spyOn(mockFileService, 'save')

      expect(service.split('dtTestFontColorPrimary', clone(newToken))).toEqual(true)
      expect(fileSave).toBeCalledWith('designTokens', withSplitted)
    })

    it('should not split', () => {
      const withSplitted = clone(designTokens)
      const newToken = {
        ...clone(withSplitted['dtTestFontColorPrimary']),
        aliasTokens: ['atTestBaseFontColor'],
        name: 'Test Font Color Primary',
        short: 'test',
      }
      withSplitted['dtTestFontColorPrimary'].aliasTokens = ['atTestButtonFontColor']
      withSplitted['dtSplittedToken'] = newToken

      expect(service.split('dtTestFontColorPrimary', clone(newToken))).toEqual(false)
    })
  })

  describe('selectAliasTokens', () => {
    it('should select aliasTokens', () => {
      const clonedTokens = clone(designTokens)
      clonedTokens['dtTestFontColorPrimary'].aliasTokens = [
        'atTestBaseFontColor',
        'atTestButtonBackground',
      ]
      const fileSave = jest.spyOn(mockFileService, 'save')

      expect(
        service.selectAliasTokens('dtTestFontColorPrimary', [
          'atTestBaseFontColor',
          'atTestButtonBackground',
        ])
      ).toEqual(true)
      expect(fileSave).toBeCalledWith('designTokens', clonedTokens)
    })

    it('should not select aliasTokens', () => {
      const clonedTokens = clone(designTokens)
      clonedTokens['dtTestFontColorPrimary'].aliasTokens = [
        'atTestBaseFontColor',
        'atTestButtonBackground',
      ]

      expect(
        service.selectAliasTokens('dtDoesNotExists', [
          'atTestBaseFontColor',
          'atTestButtonBackground',
        ])
      ).toEqual(false)
    })
  })

  describe('delete', () => {
    it('should delete one', () => {
      const withOneLess = clone(designTokens)

      delete withOneLess['dtTestFontColorPrimary']

      const fileSave = jest.spyOn(mockFileService, 'save')

      expect(service.delete('dtTestFontColorPrimary')).toEqual(true)
      expect(fileSave).toBeCalledWith('designTokens', withOneLess)
    })

    it('should not delete one', () => {
      expect(service.delete('dtTestFontColorTertiary')).toEqual(false)
    })
  })

  describe('sync', () => {
    it('should sync update designTokens', () => {
      jest.spyOn(syncService, 'designTokens').mockImplementation()

      expect(service.update('dtTestFontSize100', clone(updatedDesignToken))).toEqual(true)

      expect(syncService.designTokens).toHaveBeenCalledWith({
        action: 'update',
        primary: 'dtTestFontSize100',
        secondary: 'dtActionBackgroundUpdated',
      })
    })
  })

  describe('get changes from sync', () => {
    it('should update a aliasToken', () => {
      const withUpdatedAliasToken = clone(designTokens)

      withUpdatedAliasToken.dtTestFontColorPrimary.aliasTokens = [
        'atTestBaseFontColor2',
        'atTestButtonBackground',
      ]
      const fileSave = jest.spyOn(mockFileService, 'save')

      syncService.aliasTokens({
        action: 'update',
        primary: 'atTestBaseFontColor',
        secondary: 'atTestBaseFontColor2',
      })
      expect(fileSave).toBeCalledWith('designTokens', withUpdatedAliasToken)
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
const newDesignToken2 = {
  type: 'color',
  token: 'dtActionBackgroundNew2',
  name: 'Action Background New2',
  group: 'content',
  description: 'Background for action elements',
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

const updatedDesignToken2 = {
  type: 'color',
  token: 'dtActionBackgroundUpdated2',
  name: 'Action Background Updated2',
  group: 'content',
  description: 'Background for action elements',
}
