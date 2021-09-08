import { Test, TestingModule } from '@nestjs/testing'

import { ThemeService } from '../services/theme.service'
import { ThemeController } from './theme.controller'

describe('ThemeController', () => {
  let controller: ThemeController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThemeController],
      providers: [{ provide: ThemeService, useValue: jest.mock }],
    }).compile()

    controller = module.get<ThemeController>(ThemeController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
