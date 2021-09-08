import { Test, TestingModule } from '@nestjs/testing'
import { clone } from '@utils'
import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
import { BaseValueService } from './base-value.service'
import { ConfigService } from './config.service'
import { SyncService } from './sync.service'

describe('BaseValueService', () => {
  let service: BaseValueService
  let syncService: SyncService

  beforeEach(async () => {
    syncService = new SyncService()
    jest.spyOn(fs, 'writeFileSync').mockImplementation()
    jest.spyOn(jsonfile, 'readFileSync').mockReturnValue(clone(baseValues))
    jest.spyOn(jsonfile, 'writeFileSync').mockImplementation()

    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseValueService, ConfigService, { provide: SyncService, useValue: syncService }],
    }).compile()

    service = module.get<BaseValueService>(BaseValueService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('read', () => {
    it('should return all', () => {
      expect(service.read()).toEqual(clone(baseValues))
    })
  })

  describe('create', () => {
    it('should create one', () => {
      const clonedBaseValue = clone(newBaseValue)
      clonedBaseValue.value = '#eeeeee'

      const withOneMore = clone(baseValues)

      withOneMore.global['testNew_white'] = clonedBaseValue

      expect(service.create(clone(newBaseValue))).toEqual(clonedBaseValue)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './libs/components/design-system/baseValues.json',
        withOneMore,
        { spaces: 2 }
      )
    })

    it('should create one for client', () => {
      const clonedBaseValue = clone(newBaseValue)
      clonedBaseValue.value = '#eeeeee'

      const withOneMore = clone(baseValues)

      withOneMore.clients.testClient1.values[`${newBaseValue.group}_white`] = clonedBaseValue

      expect(service.create(clone(newBaseValue), 'testClient1')).toEqual(clonedBaseValue)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './libs/components/design-system/baseValues.json',
        withOneMore,
        { spaces: 2 }
      )
    })

    it('should not create if value already exist', () => {
      expect(service.create(clone(baseValues).global.test_white)).toEqual(null)
    })

    it('should not create if client does not exist', () => {
      expect(service.create(clone(newBaseValue), 'test3')).toEqual(null)
    })

    it('should not create if client value exist for client', () => {
      expect(
        service.create(clone(baseValues).clients.testClient1.values.brandTest_primary, 'test1')
      ).toEqual(null)
    })
  })

  describe('update', () => {
    it('should update one global value', () => {
      const clonedBaseValue = clone(updatedBaseValue)
      clonedBaseValue.value = '#dddddd'

      const withOneUpdated = clone(baseValues)

      delete withOneUpdated.global['test_black']
      withOneUpdated.global['testUpdated_white'] = clonedBaseValue

      expect(service.update('test_black', clone(updatedBaseValue))).toEqual(clonedBaseValue)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './libs/components/design-system/baseValues.json',
        withOneUpdated,
        { spaces: 2 }
      )
    })

    it('should update one tenent value', () => {
      const clonedBaseValue = clone(updatedBaseValue)
      clonedBaseValue.value = '#dddddd'

      const withOneUpdated = clone(baseValues)

      delete withOneUpdated.clients.testClient1.values['actionTest_primary']
      withOneUpdated.clients.testClient1.values['testUpdated_white'] = clonedBaseValue

      expect(service.update('actionTest_primary', clone(updatedBaseValue), 'testClient1')).toEqual(
        clonedBaseValue
      )
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './libs/components/design-system/baseValues.json',
        withOneUpdated,
        { spaces: 2 }
      )
    })

    it('should not update one global value', () => {
      expect(service.update('test_red', updatedBaseValue)).toEqual(null)
    })

    it('should not update a tenent value', () => {
      expect(service.update('brandTest_teriary', updatedBaseValue, 'testClient1')).toEqual(null)
    })

    it('should can not update with wrong tenent', () => {
      expect(service.update('brandTest_teriary', updatedBaseValue, 'test3')).toEqual(null)
    })

    it('should can not update with wrong value key', () => {
      expect(
        service.update(
          'brandTest_primary',
          clone(baseValues).clients.testClient1.values.fontSizeTest_primary,
          'test1'
        )
      ).toEqual(null)
    })
  })

  describe('delete', () => {
    it('should delete a global value', () => {
      const withOneLess = clone(baseValues)

      delete withOneLess.global['test_black']

      expect(service.delete('test_black')).toEqual(true)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './libs/components/design-system/baseValues.json',
        withOneLess,
        { spaces: 2 }
      )
    })

    it('should not delete a global value', () => {
      expect(service.delete('test_red')).toEqual(false)
    })

    it('should delete a client value', () => {
      const withOneLess = clone(baseValues)

      delete withOneLess.clients.testClient1.values['brandTest_secondary']

      expect(service.delete('brandTest_secondary', 'testClient1')).toEqual(true)
      expect(jsonfile.writeFileSync).toBeCalledWith(
        './libs/components/design-system/baseValues.json',
        withOneLess,
        { spaces: 2 }
      )
    })

    it('should not delete a client value with wrong client', () => {
      expect(service.delete('brandTest_primary', 'test3')).toEqual(false)
    })

    it('should not delete a client value with wrong key', () => {
      expect(service.delete('test_red', 'test1')).toEqual(false)
    })
  })

  describe('generated fs', () => {
    it('should generate scss fs', () => {
      jest.spyOn(fs, 'writeFileSync').mockImplementation()
      const withOneLess = clone(baseValues)

      delete withOneLess['test_white']

      expect(service.delete('test_white')).toEqual(true)

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        './libs/components/src/assets/generated/baseValues.scss',
        `$global_test_white: #ffffff;
$global_test_black: #333333;
$testClient1_brandTest_primary: #ff0000;
$testClient1_brandTest_secondary: #ee3333;
$testClient1_actionTest_primary: #33ee33;
$testClient1_fontSizeTest_primary: 0.75rem;
$testClient2_brandTest_primary: #0000ff;
$testClient2_brandTest_secondary: #3333ee;
$testClient2_dangerTest_primary: #ff5555;
$testClient2_fontSizeTest_normal: 0.7rem;
`
      )
    })
  })

  describe('sync', () => {
    it('should sync create baseValues', () => {
      const clonedBaseValue = clone(newBaseValue)
      clonedBaseValue.value = '#eeeeee'

      jest.spyOn(syncService, 'baseValues').mockImplementation()
      expect(service.create(clone(newBaseValue))).toEqual(clonedBaseValue)

      expect(syncService.baseValues).toHaveBeenCalledWith({
        action: 'create',
        primary: 'global_testNew_white',
        values: [
          'global_test_white',
          'global_test_black',
          'global_testNew_white',
          'testClient1_brandTest_primary',
          'testClient1_brandTest_secondary',
          'testClient1_actionTest_primary',
          'testClient1_fontSizeTest_primary',
          'testClient2_brandTest_primary',
          'testClient2_brandTest_secondary',
          'testClient2_dangerTest_primary',
          'testClient2_fontSizeTest_normal',
        ],
      })
    })

    it('should sync update baseValues', () => {
      jest.spyOn(syncService, 'baseValues').mockImplementation()
      expect(service.update('brandTest_primary', clone(updatedBaseValue), 'testClient1')).toEqual(
        updatedBaseValue
      )

      expect(syncService.baseValues).toHaveBeenCalledWith({
        action: 'update',
        primary: 'testClient1_brandTest_primary',
        secondary: 'testClient1_testUpdated_white',
        values: [
          'global_test_white',
          'global_test_black',
          'testClient1_brandTest_secondary',
          'testClient1_actionTest_primary',
          'testClient1_fontSizeTest_primary',
          'testClient1_testUpdated_white',
          'testClient2_brandTest_primary',
          'testClient2_brandTest_secondary',
          'testClient2_dangerTest_primary',
          'testClient2_fontSizeTest_normal',
        ],
      })
    })
    it('should sync delete baseValues', () => {
      jest.spyOn(syncService, 'baseValues').mockImplementation()
      expect(service.delete('actionTest_primary', 'testClient1')).toEqual(true)

      expect(syncService.baseValues).toHaveBeenCalledWith({
        action: 'delete',
        primary: 'testClient1_actionTest_primary',
        values: [
          'global_test_white',
          'global_test_black',
          'testClient1_brandTest_primary',
          'testClient1_brandTest_secondary',
          'testClient1_fontSizeTest_primary',
          'testClient2_brandTest_primary',
          'testClient2_brandTest_secondary',
          'testClient2_dangerTest_primary',
          'testClient2_fontSizeTest_normal',
        ],
      })
    })
  })

  // describe('get changes from sync', () => {
  //   it('should create a client', () => {
  //     const withNewClient = clone(baseValues)

  //     withNewClient.clients['test3'] = {
  //       name: 'test3',
  //       client: 'test3',
  //       values: {},
  //     }

  //     syncService.clients({
  //       action: 'create',
  //       primary: 'test3',
  //       values: ['test1', 'test2', 'test3'],
  //     })
  //     expect(service.read()).toEqual(withNewClient)
  //   })

  //   it('should update a client', () => {
  //     const withUpdatedClient = clone(baseValues)

  //     withUpdatedClient.clients['test3'] = withUpdatedClient.clients.test1
  //     withUpdatedClient.clients['test3'].name = 'test3'

  //     delete withUpdatedClient.clients.test1

  //     syncService.clients({
  //       action: 'update',
  //       primary: 'test1',
  //       secondary: 'test3',
  //       values: ['test2', 'test3'],
  //     })
  //     expect(service.read()).toEqual(withUpdatedClient)
  //   })

  //   it('should update/copy a client', () => {
  //     const withUpdatedClient = clone(baseValues)

  //     withUpdatedClient.clients['test3'] = withUpdatedClient.clients.test1
  //     withUpdatedClient.clients['test3'].name = 'test3'

  //     syncService.clients({
  //       action: 'update',
  //       primary: 'test1',
  //       secondary: 'test3',
  //       values: ['test1', 'test2', 'test3'],
  //     })
  //     expect(service.read()).toEqual(withUpdatedClient)
  //   })

  //   it('should delete a client', () => {
  //     const deletedClient = clone(baseValues)

  //     delete deletedClient.clients.test1

  //     syncService.clients({
  //       action: 'delete',
  //       primary: 'test1',
  //       values: ['test2'],
  //     })
  //     expect(service.read()).toEqual(deletedClient)
  //   })
  // })
})

const newBaseValue = {
  type: 'color',
  group: 'testNew',
  name: 'White',
  value: '#eee',
}

const updatedBaseValue = {
  type: 'color',
  group: 'testUpdated',
  name: 'White',
  value: '#ddd',
}

const baseValues = {
  global: {
    test_white: {
      type: 'color',
      group: 'test',
      name: 'White',
      value: '#fff',
    },
    test_black: {
      type: 'color',
      group: 'test',
      name: 'Black',
      value: '#333',
    },
  },
  clients: {
    testClient1: {
      name: 'Test Client 1',
      client: 'testClient1',
      values: {
        brandTest_primary: {
          type: 'color',
          group: 'brandTest',
          name: 'Primary',
          value: '#f00',
        },
        brandTest_secondary: {
          type: 'color',
          group: 'brandTest',
          name: 'Secondary',
          value: '#e33',
        },
        actionTest_primary: {
          type: 'color',
          group: 'actionTest',
          name: 'Primary',
          value: '#3e3',
        },
        fontSizeTest_primary: {
          type: 'font-size',
          group: 'fontSizeTest',
          name: 'Primary',
          value: '0.75rem',
        },
      },
    },
    testClient2: {
      name: 'Test Client 2',
      client: 'testClient2',
      values: {
        brandTest_primary: {
          type: 'color',
          group: 'brandTest',
          name: 'Primary',
          value: '#00f',
        },
        brandTest_secondary: {
          type: 'color',
          group: 'brandTest',
          name: 'Secondary',
          value: '#33e',
        },
        dangerTest_primary: {
          type: 'color',
          group: 'dangerTest',
          name: 'Primary',
          value: '#f55',
        },
        fontSizeTest_normal: {
          type: 'font-size',
          group: 'fontSizeTest',
          name: 'Normal',
          value: '0.7rem',
        },
      },
    },
  },
}
