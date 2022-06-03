import { Test, TestingModule } from '@nestjs/testing'
import { SyncData } from '@typings'
import { clone } from '@utils'
import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
import { aliasTokens, designTokens, styleGuides, themes } from './samples'
import { SyncService } from './sync.service'

describe('SyncService', () => {
  let service: SyncService

  beforeEach(async () => {
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [SyncService],
    }).compile()

    service = module.get<SyncService>(SyncService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should register one sync callback', (done) => {
    const myCallBack1 = (data: SyncData) => {
      expect(data).toEqual(syncData)
      done()
    }

    service.register('aliasTokens', myCallBack1)
    service.aliasTokens(syncData)
  })

  it('should register one create callback', (done) => {
    const myCallBack1 = (data: SyncData) => {
      expect(data).toEqual(createData)
      done()
    }

    service.register('aliasTokens', myCallBack1)
    service.aliasTokens(createData)
  })

  it('should register one update callback', (done) => {
    const myCallBack1 = (data: SyncData) => {
      expect(data).toEqual(updateData)
      done()
    }

    service.register('aliasTokens', myCallBack1)
    service.aliasTokens(updateData)
  })

  it('should register one delete callback', (done) => {
    const myCallBack1 = (data: SyncData) => {
      expect(data).toEqual(deleteData)
      done()
    }

    service.register('aliasTokens', myCallBack1)
    service.aliasTokens(deleteData)
  })

  it('should register on two scopes', (done) => {
    let counter = 0
    const myCallBack1 = (data: SyncData) => {
      counter++
      expect(data).toEqual(syncData)
    }
    const myCallBack2 = (data: SyncData) => {
      counter++
      expect(data).toEqual(updateData)
      expect(counter).toEqual(2)
      done()
    }

    service.register('aliasTokens', myCallBack1)
    service.register('styleGuides', myCallBack2)
    service.aliasTokens(syncData)
    service.styleGuides(updateData)
  })

  it('should register one callback', (done) => {
    let counter = 0
    const myCallBack1 = () => {
      counter++
    }
    const myCallBack2 = () => {
      counter++
      expect(counter).toEqual(3)
      done()
    }

    service.register('aliasTokens', myCallBack1)
    service.register('styleGuides', myCallBack1)
    service.register('aliasTokens', myCallBack2)
    service.styleGuides(deleteData)
    service.aliasTokens(deleteData)
  })
})

const syncData: SyncData = { values: ['item1', 'item2'], action: 'sync' }

const createData: SyncData = {
  values: ['item1', 'item2'],
  action: 'create',
  primary: 'item2',
}

const updateData: SyncData = {
  values: ['item1', 'item2'],
  action: 'update',
  primary: 'item_old',
  secondary: 'item2',
}

const deleteData: SyncData = {
  values: ['item1', 'item2'],
  action: 'delete',
  primary: 'item3',
}
