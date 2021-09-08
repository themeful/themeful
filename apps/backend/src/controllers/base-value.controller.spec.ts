import { Test, TestingModule } from '@nestjs/testing'

import { BaseValueService } from '../services/base-value.service'
import { BaseValueController } from './base-value.controller'

describe('BaseValueController', () => {
  let controller: BaseValueController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaseValueController],
      providers: [{ provide: BaseValueService, useValue: jest.mock }],
    }).compile()

    controller = module.get<BaseValueController>(BaseValueController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
