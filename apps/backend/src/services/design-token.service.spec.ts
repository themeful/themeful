import { Test, TestingModule } from '@nestjs/testing'
import { DesignToken } from '@typings'
import * as utils from '@utils'
import { clone } from '@utils'
import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
import { ConfigService } from './config.service'
import { DesignTokenService } from './design-token.service'
import { SyncService } from './sync.service'

describe('DesignTokenService', () => {
  let service: DesignTokenService
  let syncService: SyncService

  beforeEach(async () => {
    syncService = new SyncService()
    jest.spyOn(fs, 'writeFileSync').mockImplementation()
    jest.spyOn(jsonfile, 'readFileSync').mockReturnValue(clone(designTokens))
    jest.spyOn(jsonfile, 'writeFileSync').mockImplementation()
    jest.spyOn(utils, 'uuid').mockReturnValue('test')

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DesignTokenService,
        ConfigService,
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
      const clonedDesignToken: DesignToken = clone(newDesignToken)
      delete clonedDesignToken.token
      clonedDesignToken.short = 'test'

      const withOneMore = clone(designTokens)
      withOneMore[newDesignToken.token] = clonedDesignToken

      expect(service.create(clone(newDesignToken))).toEqual(clonedDesignToken)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './libs/components/design-system/designTokens.json',
        withOneMore,
        { spaces: 2 }
      )
    })

    it('should not create one', () => {
      const clonedDesignToken: DesignToken = clone(designTokens.dtTestActionBG)
      clonedDesignToken.token = 'dtTestActionBG'
      expect(service.create(clonedDesignToken)).toEqual(null)
    })
  })

  describe('update', () => {
    it('should update one', () => {
      const clonedDesignToken: DesignToken = clone(updatedDesignToken)
      delete clonedDesignToken.token

      const withOneUpdated = clone(designTokens)

      delete withOneUpdated['dtTestFontColorPrimary']
      withOneUpdated[updatedDesignToken.token] = clonedDesignToken

      expect(service.update('dtTestFontColorPrimary', clone(updatedDesignToken))).toEqual(
        clonedDesignToken
      )
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './libs/components/design-system/designTokens.json',
        withOneUpdated,
        { spaces: 2 }
      )
    })

    it('should not update one', () => {
      expect(service.update('dtTestWrongFontColorPrimary', clone(updatedDesignToken))).toEqual(null)
    })

    it('should not update to existing one', () => {
      const clonedDesignToken: DesignToken = clone(designTokens.dtTestActionBG)
      clonedDesignToken.token = 'dtTestActionBG'
      expect(service.update('dtTestFontColorPrimary', clonedDesignToken)).toEqual(null)
    })
  })

  describe('delete', () => {
    it('should delete one', () => {
      const withOneLess = clone(designTokens)

      delete withOneLess['dtTestFontColorPrimary']

      expect(service.delete('dtTestFontColorPrimary')).toEqual(true)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './libs/components/design-system/designTokens.json',
        withOneLess,
        { spaces: 2 }
      )
    })

    it('should not delete one', () => {
      expect(service.delete('dtTestFontColorTertiary')).toEqual(false)
    })
  })

  describe('generated files', () => {
    it('should generate scss files', () => {
      jest.spyOn(fs, 'writeFileSync').mockImplementation()
      const withOneLess = clone(designTokens)

      delete withOneLess['dtTestFontColorPrimary']

      expect(service.delete('dtTestFontColorPrimary')).toEqual(true)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './libs/components/src/assets/generated/designTokens.scss',
        `$atButtonBackground: var(--dtTestActionBG);
$atBaseFontColor: var(--dtTestFontColorPrimary);
$atButtonFontColor: var(--dtTestFontColorPrimary);
$atButtonFontSize: var(--dtTestFontSize100);
`
      )
    })
  })
  describe('sync', () => {
    it('should sync create designTokens', () => {
      jest.spyOn(syncService, 'designTokens').mockImplementation()

      const clonedDesignToken: DesignToken = clone(newDesignToken)
      delete clonedDesignToken.token
      clonedDesignToken.short = 'test'

      expect(service.create(clone(newDesignToken))).toEqual(clonedDesignToken)

      expect(syncService.designTokens).toHaveBeenCalledWith({
        action: 'create',
        primary: 'dtTestActionBGNew',
        values: [
          'dtTestActionBG',
          'dtTestFontColorPrimary',
          'dtTestFontSize100',
          'dtTestActionBGNew',
        ],
      })
    })

    it('should sync update designTokens', () => {
      jest.spyOn(syncService, 'designTokens').mockImplementation()

      const clonedDesignToken: DesignToken = clone(updatedDesignToken)
      delete clonedDesignToken.token

      expect(service.update('dtTestFontSize100', clone(updatedDesignToken))).toEqual(
        clonedDesignToken
      )

      expect(syncService.designTokens).toHaveBeenCalledWith({
        action: 'update',
        primary: 'dtTestFontSize100',
        secondary: 'dtTestActionBGUpdated',
        values: ['dtTestActionBG', 'dtTestFontColorPrimary', 'dtTestActionBGUpdated'],
      })
    })
    it('should sync delete designTokens', () => {
      jest.spyOn(syncService, 'designTokens').mockImplementation()
      expect(service.delete('dtTestFontSize100')).toEqual(true)

      expect(syncService.designTokens).toHaveBeenCalledWith({
        action: 'delete',
        primary: 'dtTestFontSize100',
        values: ['dtTestActionBG', 'dtTestFontColorPrimary'],
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
          'dtTestActionBGUpdated',
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
  token: 'dtTestActionBGNew',
  name: 'Action Background New',
  group: 'content',
  description: 'Background for action elements',
  properties: ['color', 'background-color'],
  aliasTokens: ['atButtonBackground'],
}

const updatedDesignToken = {
  token: 'dtTestActionBGUpdated',
  name: 'Action Background Updated',
  group: 'content',
  short: 'gjG',
  description: 'Background for action elements',
  properties: ['color', 'background-color'],
  aliasTokens: ['atButtonBackground'],
}

const designTokens = {
  dtTestActionBG: {
    short: 'dQB',
    name: 'Action Background',
    group: 'controls',
    description: 'Background for action elements',
    properties: ['color', 'background-color'],
    aliasTokens: ['atButtonBackground'],
  },
  dtTestFontColorPrimary: {
    short: 'DmP',
    name: 'Normal Font Color',
    group: 'content',
    description: 'Font color for normal text',
    properties: ['color'],
    aliasTokens: ['atBaseFontColor', 'atButtonFontColor'],
  },
  dtTestFontSize100: {
    short: 'gjG',
    name: 'Normal Font Size',
    group: 'content',
    description: 'Font size for normal text',
    properties: ['font-size'],
    aliasTokens: ['atButtonFontSize'],
  },
}
