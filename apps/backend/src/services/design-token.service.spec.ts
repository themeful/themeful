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
    // it('should create one', () => {
    //   const clonedDesignToken: DesignTokenAPI = clone(newDesignToken)
    //   delete clonedDesignToken.token
    //   clonedDesignToken.short = 'test'

    //   const withOneMore = clone(designTokens)
    //   withOneMore[newDesignToken.token] = clonedDesignToken

    //   const fileSave = jest.spyOn(mockFileService.prototype, 'save')

    //   expect(service.create(clone(newDesignToken))).toEqual(true)
    //   expect(fileSave).toBeCalledWith('designTokens', withOneMore)
    // })

    it('should not create one', () => {
      const clonedDesignToken: DesignTokenAPI = {
        ...clone(designTokens.dtTestActionBackground),
        token: 'dtTestActionBackground',
      }
      expect(service.create(clonedDesignToken)).toEqual(false)
    })
  })

  describe('update', () => {
    // it('should update one', () => {
    //   const clonedDesignToken: DesignTokenAPI = clone(updatedDesignToken)
    //   delete clonedDesignToken.token

    //   const withOneUpdated = clone(designTokens)

    //   delete withOneUpdated['dtTestFontColorPrimary']
    //   withOneUpdated[updatedDesignToken.token] = clonedDesignToken

    //   expect(service.update('dtTestFontColorPrimary', clone(updatedDesignToken))).toEqual(true)
    //   expect(jsonfile.writeFileSync).toBeCalledWith(
    //     './sample/generated/designTokens.json',
    //     withOneUpdated,
    //     { spaces: 2 }
    //   )
    // })

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
    // it('should delete one', () => {
    //   const withOneLess = clone(designTokens)

    //   delete withOneLess['dtTestFontColorPrimary']

    //   expect(service.delete('dtTestFontColorPrimary')).toEqual(true)
    //   expect(jsonfile.writeFileSync).toBeCalledWith(
    //     './sample/generated/designTokens.json',
    //     withOneLess,
    //     { spaces: 2 }
    //   )
    // })

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

  // describe('get changes from sync', () => {
  //   it('should update a aliasToken', () => {
  //     const withUpdatedAliasToken = clone(designTokens)

  //     withUpdatedAliasToken.dtTestFontColorPrimary.aliasTokens = [
  //       'atButtonFontColor',
  //       'atNewBaseFontColor',
  //     ]

  //     syncService.aliasTokens({
  //       action: 'update',
  //       primary: 'atBaseFontColor',
  //       secondary: 'atNewBaseFontColor',
  //     })
  //     expect(service.read()).toEqual(withUpdatedAliasToken)
  //   })
  // })
})

// const newDesignToken = {
//   type: 'color',
//   short: 'xyz',
//   token: 'dtActionBackgroundNew',
//   name: 'Action Background New',
//   group: 'content',
//   description: 'Background for action elements',
//   properties: ['color', 'background-color'],
//   aliasTokens: ['atButtonBackground'],
// }

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
