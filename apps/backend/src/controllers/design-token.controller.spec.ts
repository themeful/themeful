import { Test, TestingModule } from '@nestjs/testing'

import { DesignTokenService } from '../services/design-token.service'
import { DesignTokenController } from './design-token.controller'

describe('DesignTokenController', () => {
  let controller: DesignTokenController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesignTokenController],
      providers: [{ provide: DesignTokenService, useValue: jest.mock }],
    }).compile()

    controller = module.get<DesignTokenController>(DesignTokenController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
