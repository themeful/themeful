import { Test, TestingModule } from '@nestjs/testing'
import { Style, StyleGuides } from '@typings'
import { clone } from '@utils'
import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
import { ConfigService } from './config.service'
import { StyleGuideService } from './style-guide.service'
import { SyncService } from './sync.service'

describe('StyleGuideService', () => {
  let service: StyleGuideService
  let syncService: SyncService

  beforeEach(async () => {
    syncService = new SyncService()
    jest.spyOn(fs, 'writeFileSync').mockImplementation()
    jest.spyOn(jsonfile, 'readFileSync').mockReturnValue(clone(styleGuides))
    jest.spyOn(jsonfile, 'writeFileSync').mockImplementation()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StyleGuideService,
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

    service = module.get<StyleGuideService>(StyleGuideService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('read', () => {
    it('should return all', () => {
      expect(service.read()).toEqual(clone(styleGuides))
    })
  })

  describe('create', () => {
    it('should create one', () => {
      const clonedBaseValue = clone(newBaseValue)
      clonedBaseValue.value = '#2be053'

      const withOneMore = clone(styleGuides)

      withOneMore.global.styles['base_primary'] = clonedBaseValue

      expect(service.create(clone(newBaseValue))).toEqual(true)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './sample/generated/styleGuides.json',
        withOneMore,
        { spaces: 2 }
      )
    })

    it('should create one for styleGuide', () => {
      const clonedBaseValue = clone(newBaseValue)
      clonedBaseValue.value = '#2be053'

      const withOneMore = clone(styleGuides)

      withOneMore.styleGuide1.styles['base_primary'] = clonedBaseValue

      expect(service.create(clone(newBaseValue), 'styleGuide1')).toEqual(true)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './sample/generated/styleGuides.json',
        withOneMore,
        { spaces: 2 }
      )
    })

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
    it('should update one global value', () => {
      const clonedBaseValue = clone(updatedBaseValue)
      clonedBaseValue.value = '#dddddd'

      const withOneUpdated = clone(styleGuides)

      delete withOneUpdated.global.styles['base_black']
      withOneUpdated.global.styles['testUpdated_white'] = clonedBaseValue

      expect(service.update('base_black', clone(updatedBaseValue))).toEqual(true)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './sample/generated/styleGuides.json',
        withOneUpdated,
        { spaces: 2 }
      )
    })

    it('should update one styleGuide value', () => {
      const clonedBaseValue = clone(updatedBaseValue)
      clonedBaseValue.value = '#dddddd'

      const withOneUpdated = clone(styleGuides)

      delete withOneUpdated.styleGuide1.styles['action_primary']
      withOneUpdated.styleGuide1.styles['testUpdated_white'] = clonedBaseValue

      expect(service.update('action_primary', clone(updatedBaseValue), 'styleGuide1')).toEqual(true)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './sample/generated/styleGuides.json',
        withOneUpdated,
        { spaces: 2 }
      )
    })

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
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './sample/generated/styleGuides.json',
        withOneLess,
        { spaces: 2 }
      )
    })

    it('should not delete a global value', () => {
      expect(service.delete('test_red')).toEqual(false)
    })

    it('should delete a styleGuide value', () => {
      const withOneLess = clone(styleGuides)

      delete withOneLess.styleGuide1.styles['action_primary']

      expect(service.delete('action_primary', 'styleGuide1')).toEqual(true)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './sample/generated/styleGuides.json',
        withOneLess,
        { spaces: 2 }
      )
    })

    it('should not delete a styleGuide value with wrong styleGuide', () => {
      expect(service.delete('brandTest_primary', 'styleGuide3')).toEqual(false)
    })

    it('should not delete a styleGuide value with wrong key', () => {
      expect(service.delete('test_red', 'styleGuide1')).toEqual(false)
    })
  })

  describe('generated fs', () => {
    it('should generate scss fs', () => {
      jest.spyOn(fs, 'writeFileSync').mockImplementation()

      expect(service.delete('base_light')).toEqual(true)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './sample/generated/styleGuides.scss',
        `$global_base_black: #333333;
$global_base_light: #ffffff;
$styleGuide1_action_primary: #31ed31;
$styleGuide1_action_secondary: #2ec22e;
$styleGuide1_action_tertiary: #1e961e;
$styleGuide2_action_primary: #ff5555;
$styleGuide2_action_secondary: #d22828;
$styleGuide3_base_primary: #2be053;
@mixin global_mediaQuery_aboveSmallMobile {
  @media screen and (min-width: 321px) {
    @content;
  }
}
`
      )
    })
  })

  describe('sync', () => {
    it('should sync create styleGuides', () => {
      jest.spyOn(syncService, 'styleGuides').mockImplementation()
      expect(service.create(clone(newBaseValue))).toEqual(true)

      expect(syncService.styleGuides).toHaveBeenCalledWith({
        action: 'create',
        primary: 'global_base_primary',
        values: [
          'global_base_black',
          'global_base_light',
          'global_base_primary',
          'global_mediaQuery_aboveSmallMobile',
          'styleGuide1_action_primary',
          'styleGuide1_action_secondary',
          'styleGuide1_action_tertiary',
          'styleGuide2_action_primary',
          'styleGuide2_action_secondary',
          'styleGuide3_base_primary',
        ],
      })
    })

    it('should sync update styleGuides', () => {
      jest.spyOn(syncService, 'styleGuides').mockImplementation()
      expect(service.update('action_primary', clone(updatedBaseValue), 'styleGuide1')).toEqual(true)

      expect(syncService.styleGuides).toHaveBeenCalledWith({
        action: 'update',
        primary: 'styleGuide1_action_primary',
        secondary: 'styleGuide1_testUpdated_white',
        values: [
          'global_base_black',
          'global_base_light',
          'global_mediaQuery_aboveSmallMobile',
          'styleGuide1_action_secondary',
          'styleGuide1_action_tertiary',
          'styleGuide1_testUpdated_white',
          'styleGuide2_action_primary',
          'styleGuide2_action_secondary',
          'styleGuide3_base_primary',
        ],
      })
    })
    it('should sync delete styleGuides', () => {
      jest.spyOn(syncService, 'styleGuides').mockImplementation()
      expect(service.delete('action_secondary', 'styleGuide1')).toEqual(true)

      expect(syncService.styleGuides).toHaveBeenCalledWith({
        action: 'delete',
        primary: 'styleGuide1_action_secondary',
        values: [
          'global_base_black',
          'global_base_light',
          'global_mediaQuery_aboveSmallMobile',
          'styleGuide1_action_primary',
          'styleGuide1_action_tertiary',
          'styleGuide2_action_primary',
          'styleGuide2_action_secondary',
          'styleGuide3_base_primary',
        ],
      })
    })
  })

  // describe('get changes from sync', () => {
  //   it('should create a styleGuide', () => {
  //     const withNewClient = clone(styleGuides)

  //     withNewClient['styleGuide3'] = {
  //       name: 'styleGuide3',
  //       styleGuide: 'styleGuide3',
  //       values: {},
  //     }

  //     syncService({
  //       action: 'create',
  //       primary: 'styleGuide3',
  //       values: ['styleGuide1', 'styleGuide2', 'styleGuide3'],
  //     })
  //     expect(service.read()).toEqual(withNewClient)
  //   })

  //   it('should update a styleGuide', () => {
  //     const withUpdatedClient = clone(styleGuides)

  //     withUpdatedClient['styleGuide3'] = withUpdatedClient.styleGuide1
  //     withUpdatedClient['styleGuide3'].name = 'styleGuide3'

  //     delete withUpdatedClient.styleGuide1

  //     syncService({
  //       action: 'update',
  //       primary: 'styleGuide1',
  //       secondary: 'styleGuide3',
  //       values: ['styleGuide2', 'styleGuide3'],
  //     })
  //     expect(service.read()).toEqual(withUpdatedClient)
  //   })

  //   it('should update/copy a styleGuide', () => {
  //     const withUpdatedClient = clone(styleGuides)

  //     withUpdatedClient['styleGuide3'] = withUpdatedClient.styleGuide1
  //     withUpdatedClient['styleGuide3'].name = 'styleGuide3'

  //     syncService({
  //       action: 'update',
  //       primary: 'styleGuide1',
  //       secondary: 'styleGuide3',
  //       values: ['styleGuide1', 'styleGuide2', 'styleGuide3'],
  //     })
  //     expect(service.read()).toEqual(withUpdatedClient)
  //   })

  //   it('should delete a styleGuide', () => {
  //     const deletedClient = clone(styleGuides)

  //     delete deletedClient.styleGuide1

  //     syncService({
  //       action: 'delete',
  //       primary: 'styleGuide1',
  //       values: ['styleGuide2'],
  //     })
  //     expect(service.read()).toEqual(deletedClient)
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

const styleGuides: StyleGuides = {
  global: {
    name: 'Global',
    baseFontSize: 16,
    styles: {
      base_black: {
        name: 'Black',
        type: 'color',
        group: 'Base',
        slug: 'base_black',
        value: '#333333',
      },
      base_light: {
        name: 'Light',
        type: 'color',
        group: 'Base',
        slug: 'base_light',
        value: '#ffffff',
      },
      mediaQuery_aboveSmallMobile: {
        name: 'Above Small Mobile',
        type: 'mediaquery',
        group: 'Media query',
        slug: 'mediaQuery_aboveSmallMobile',
        value: 'screen and (min-width: 321px)',
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
        group: 'Action',
        slug: 'action_primary',
        value: '#31ed31',
      },
      action_secondary: {
        name: 'Secondary',
        type: 'color',
        group: 'Action',
        slug: 'action_secondary',
        value: '#2ec22e',
      },
      action_tertiary: {
        name: 'Tertiary',
        type: 'color',
        group: 'Action',
        slug: 'action_tertiary',
        value: '#1e961e',
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
        group: 'Action',
        slug: 'action_primary',
        value: '#ff5555',
      },
      action_secondary: {
        name: 'Secondary',
        type: 'color',
        group: 'Action',
        slug: 'action_secondary',
        value: '#d22828',
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
        group: 'Base',
        slug: 'base_primary',
        value: '#2be053',
      },
    },
  },
}
