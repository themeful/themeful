import { Test, TestingModule } from '@nestjs/testing'
import * as utils from '../utils/system.util'
import { ComponentService } from './component.service'
import { ConfigService } from './config.service'
import { FileService } from './file.service'
import { mockConfigService, mockFileService } from './service.mock'
import { SyncService } from './sync.service'

describe('ComponentService', () => {
  let service: ComponentService
  let syncService: SyncService

  beforeEach(async () => {
    syncService = new SyncService()

    jest.spyOn(mockFileService, 'save')
    jest.spyOn(mockFileService, 'components$')

    jest
      .spyOn(utils, 'findSync')
      .mockReturnValue([
        'libs/components/src/lib/button/button.component.scss',
        'libs/components/src/lib/card/card.component.scss',
      ])

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComponentService,
        { provide: FileService, useValue: mockFileService },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        { provide: SyncService, useValue: syncService },
      ],
    }).compile()

    service = module.get<ComponentService>(ComponentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
