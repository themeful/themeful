import { Test, TestingModule } from '@nestjs/testing'
import { StyleGuideService } from '../services/style-guide.service'
import { StyleController } from './style.controller'

describe('StyleController', () => {
  let controller: StyleController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StyleController],
      providers: [{ provide: StyleGuideService, useValue: jest.mock }],
    }).compile()

    controller = module.get<StyleController>(StyleController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
