import { Test, TestingModule } from '@nestjs/testing'
import { Style } from '@typings'
import { clone } from '@utils'
import { ConfigService } from './config.service'
import { FileService } from './file.service'
import { styleGuides } from './samples.mock'
import { mockConfigService, mockFileService } from './service.mock'
import { StyleGuideService } from './style-guide.service'
import { SyncService } from './sync.service'

describe('StyleGuideService', () => {
  let service: StyleGuideService
  let syncService: SyncService

  beforeEach(async () => {
    syncService = new SyncService()

    jest.spyOn(mockFileService, 'save')
    jest.spyOn(mockFileService, 'styleGuides$')

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StyleGuideService,
        {
          provide: FileService,
          useValue: mockFileService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        { provide: SyncService, useValue: syncService },
      ],
    }).compile()

    service = module.get<StyleGuideService>(StyleGuideService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    // it('should create one', () => {
    //   const clonedBaseValue = clone(newBaseValue)
    //   clonedBaseValue.value = '#2be053'

    //   const withOneMore = clone(styleGuides)

    //   withOneMore.global.styles['base_primary'] = clonedBaseValue

    //   const fileSave = jest.spyOn(FileService.prototype, 'save')

    //   expect(service.create(clone(newBaseValue))).toEqual(true)
    //   expect(fileSave).toBeCalledWith('styleGuides', withOneMore)
    // })

    // it('should create one for styleGuide', () => {
    //   const clonedBaseValue = clone(newBaseValue)
    //   clonedBaseValue.value = '#2be053'

    //   const withOneMore = clone(styleGuides)

    //   withOneMore.styleGuide1.styles['base_primary'] = clonedBaseValue

    //   expect(service.create(clone(newBaseValue), 'styleGuide1')).toEqual(true)
    //   expect(jsonfile.writeFileSync).toBeCalledWith(
    //     './sample/generated/styleGuides.json',
    //     withOneMore,
    //     { spaces: 2 }
    //   )
    // })

    it('should not create if value already exist', () => {
      expect(service.create(clone(styleGuides).global.styles.base_light as Style)).toEqual(false)
    })

    it('should not create if styleGuide does not exist', () => {
      expect(service.create(clone(newBaseValue), 'styleGuide3')).toEqual(false)
    })

    it('should not create if styleGuide value exist for styleGuide', () => {
      expect(
        service.create(clone(styleGuides).styleGuide1.styles.action_primary as Style, 'styleGuide1')
      ).toEqual(false)
    })
  })

  describe('update', () => {
    // it('should update one global value', () => {
    //   const clonedBaseValue = clone(updatedBaseValue)
    //   clonedBaseValue.value = '#dddddd'

    //   const withOneUpdated = clone(styleGuides)

    //   delete withOneUpdated.global.styles['base_black']
    //   withOneUpdated.global.styles['testUpdated_white'] = clonedBaseValue

    //   expect(service.update('base_black', clone(updatedBaseValue))).toEqual(true)
    //   expect(jsonfile.writeFileSync).toBeCalledWith(
    //     './sample/generated/styleGuides.json',
    //     withOneUpdated,
    //     { spaces: 2 }
    //   )
    // })

    // it('should update one styleGuide value', () => {
    //   const clonedBaseValue = clone(updatedBaseValue)
    //   clonedBaseValue.value = '#dddddd'

    //   const withOneUpdated = clone(styleGuides)

    //   delete withOneUpdated.styleGuide1.styles['action_primary']
    //   withOneUpdated.styleGuide1.styles['testUpdated_white'] = clonedBaseValue

    //   expect(service.update('action_primary', clone(updatedBaseValue), 'styleGuide1')).toEqual(true)
    //   expect(jsonfile.writeFileSync).toBeCalledWith(
    //     './sample/generated/styleGuides.json',
    //     withOneUpdated,
    //     { spaces: 2 }
    //   )
    // })

    it('should not update one global value', () => {
      expect(service.update('test_red', updatedBaseValue)).toEqual(false)
    })

    it('should not update a styleGuide value', () => {
      expect(service.update('brandTest_teriary', updatedBaseValue, 'styleGuide1')).toEqual(false)
    })

    it('should can not update with wrong styleGuide', () => {
      expect(service.update('brandTest_teriary', updatedBaseValue, 'styleGuide3')).toEqual(false)
    })

    it('should can not update with wrong value key', () => {
      expect(
        service.update(
          'brandTest_primary',
          clone(styleGuides).styleGuide1.styles.action_secondary as Style,
          'styleGuide1'
        )
      ).toEqual(false)
    })
  })

  describe('delete', () => {
    it('should delete a global value', () => {
      const withOneLess = clone(styleGuides)

      delete withOneLess.global.styles['base_black']

      expect(service.delete('base_black')).toEqual(true)
      expect(mockFileService.save).toBeCalledWith('styleGuides', withOneLess)
    })

    it('should not delete a global value', () => {
      expect(service.delete('test_red')).toEqual(false)
    })

    it('should delete a styleGuide value', () => {
      const withOneLess = clone(styleGuides)

      delete withOneLess.styleGuide1.styles['action_primary']

      expect(service.delete('action_primary', 'styleGuide1')).toEqual(true)
      expect(mockFileService.save).toBeCalledWith('styleGuides', withOneLess)
    })

    it('should not delete a styleGuide value with wrong styleGuide', () => {
      expect(service.delete('brandTest_primary', 'styleGuide3')).toEqual(false)
    })

    it('should not delete a styleGuide value with wrong key', () => {
      expect(service.delete('test_red', 'styleGuide1')).toEqual(false)
    })
  })

  // describe('sync', () => {
  //   it('should sync update styleGuides', () => {
  //     jest.spyOn(syncService, 'styleGuides').mockImplementation()
  //     expect(service.update('action_primary', clone(updatedBaseValue), 'styleGuide1')).toEqual(true)

  //     expect(syncService.styleGuides).toHaveBeenCalledWith({
  //       action: 'update',
  //       primary: 'styleGuide1_action_primary',
  //       secondary: 'styleGuide1_testUpdated_white',
  //     })
  //   })
  // })
})

const newBaseValue = {
  name: 'Primary',
  type: 'color',
  group: 'Base',
  slug: 'base_primary',
  value: '#2be053',
}

const updatedBaseValue = {
  type: 'color',
  group: 'Test updated',
  name: 'White',
  slug: 'testUpdated_white',
  value: '#ddd',
}
