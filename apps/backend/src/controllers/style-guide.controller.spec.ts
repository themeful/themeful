import { Test, TestingModule } from '@nestjs/testing'
import { StyleGuideService } from '../services/style-guide.service'
import { StyleGuideController } from './style-guide.controller'

describe('StyleGuideController', () => {
  let controller: StyleGuideController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StyleGuideController],
      providers: [{ provide: StyleGuideService, useValue: jest.mock }],
    }).compile()

    controller = module.get<StyleGuideController>(StyleGuideController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
