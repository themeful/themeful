import { Test, TestingModule } from '@nestjs/testing'
import { AliasTokenAPI } from '@typings'
import { clone } from '@utils'
import { FindResults } from '../utils'
import * as utils from '../utils/system.util'
import { AliasTokenService } from './alias-token.service'
import { ConfigService } from './config.service'
import { FileService } from './file.service'
import { aliasTokens } from './samples'
import { mockConfigService, mockFileService } from './service.mock'
import { SyncService } from './sync.service'

describe('AliasTokenService', () => {
  let service: AliasTokenService
  let syncService: SyncService

  beforeEach(async () => {
    syncService = new SyncService()

    jest.spyOn(mockFileService, 'save')
    jest.spyOn(mockFileService, 'aliasTokens$')

    jest.spyOn(utils, 'findSync').mockImplementation(({ term }) => {
      if (term.includes('default')) {
        return parseResultLine
      } else {
        return parseResult
      }
    })

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AliasTokenService,
        { provide: FileService, useValue: mockFileService },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        { provide: SyncService, useValue: syncService },
      ],
    }).compile()

    service = module.get<AliasTokenService>(AliasTokenService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('read', () => {
    it('should return all', () => {
      expect(service.read()).toEqual(aliasTokens)
    })
  })

  describe('create', () => {
    it('should create one', () => {
      const withOneMore = clone(aliasTokens)
      const clonedAliasToken = clone(newAliasToken)
      delete clonedAliasToken.token
      clonedAliasToken.crawled = false

      withOneMore[newAliasToken.token] = clonedAliasToken

      expect(service.create(clone(newAliasToken))).toEqual(true)
      expect(mockFileService.save).toBeCalledWith('aliasTokens', withOneMore)
    })

    it('should not create one', () => {
      expect(
        service.create({
          ...clone(aliasTokens).atTestButtonFontSize,
          token: 'atTestButtonFontSize',
        })
      ).toEqual(false)
    })

    it('should not create one with extern false', () => {
      expect(service.create({ ...clone(newAliasToken), extern: false })).toEqual(false)
    })
  })

  describe('update', () => {
    it('should update one', () => {
      const withOneUpdated = clone(aliasTokens)
      const clonedAliasToken = clone(updatedAliasToken)
      delete clonedAliasToken.token

      delete withOneUpdated['atTestBaseFontColor']
      withOneUpdated[updatedAliasToken.token] = clonedAliasToken

      expect(service.update('atTestBaseFontColor', clone(updatedAliasToken))).toEqual(true)
      expect(mockFileService.save).toBeCalledWith('aliasTokens', withOneUpdated)
    })

    it('should not update one', () => {
      expect(service.update('atTestWrongButtonBackground', clone(updatedAliasToken))).toEqual(false)
    })

    it('should not update to existing one', () => {
      const existingOne = {
        ...clone(aliasTokens).atTestButtonFontColor,
        token: 'atTestButtonFontColor',
      }
      expect(service.update('atTestBaseFontColor', existingOne)).toEqual(false)
    })

    it('should not update intern', () => {
      expect(service.update('atTestButtonBackground', clone(updatedAliasToken))).toEqual(false)
    })
  })

  describe('delete', () => {
    it('should delete one', () => {
      const withOneLess = clone(aliasTokens)

      delete withOneLess['atTestBaseFontColor']

      expect(service.delete('atTestBaseFontColor')).toEqual(true)
      expect(mockFileService.save).toBeCalledWith('aliasTokens', withOneLess)
    })

    it('should not delete not existing', () => {
      expect(service.delete('atTestWrongButtonBackground')).toEqual(false)
    })

    it('should not delete one', () => {
      expect(service.delete('atTestButtonBackground')).toEqual(false)
    })
  })

  describe('sync', () => {
    it('should sync update aliasTokens', () => {
      jest.spyOn(syncService, 'aliasTokens').mockImplementation()
      const clonedAliasToken = clone(updatedAliasToken)
      delete clonedAliasToken.token
      expect(service.update('atTestBaseFontColor', clone(updatedAliasToken))).toEqual(true)

      expect(syncService.aliasTokens).toHaveBeenCalledWith({
        action: 'update',
        primary: 'atTestBaseFontColor',
        secondary: 'atTestTabFontWeight',
        values: [
          'atTestButtonBackground',
          'atTestButtonFontColor',
          'atTestButtonFontSize',
          'atTestTabFontWeight',
        ],
      })
    })
  })
})

const newAliasToken: AliasTokenAPI = {
  token: 'atTestTabFontWeight',
  component: [],
  files: [],
  properties: ['font-weight'],
  extern: true,
  crawled: false,
}

const updatedAliasToken: AliasTokenAPI = {
  token: 'atTestTabFontWeight',
  component: ['Tab'],
  files: ['libs/components/src/lib/tab/tab.component.scss'],
  properties: ['font-weight'],
  extern: true,
  crawled: false,
}

const parseResult: FindResults = [
  {
    filename: 'libs/components/src/lib/button/button.component.scss',
    matches: [
      'background-color: $atTestButtonBackground;',
      'font-size: $atTestButtonFontSize;',
      'color: $atTestButtonFontColor;',
    ],
    line: [],
  },
]
const parseResultLine: FindResults = [
  {
    filename: 'libs/components/src/lib/button/button.component.scss',
    matches: [
      '$atTestButtonBackground1: #444 !default;',
      '$atTestButtonBackground2: #444 !default;',
      '$atTestButtonBackground3: #444 !default;',
    ],
    line: [],
  },
]
