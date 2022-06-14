import { Test, TestingModule } from '@nestjs/testing'
import { DesignTokenAPI } from '@typings'
import { DesignTokenService } from '../services/design-token.service'
import { DesignTokenController } from './design-token.controller'

describe('DesignTokenController', () => {
  let controller: DesignTokenController
  const mockDesignToken = { some: 'object' } as unknown as DesignTokenAPI
  const designTokenSlug = 'dtTestToken'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesignTokenController],
      providers: [
        {
          provide: DesignTokenService,
          useValue: {
            create: () => Promise.resolve(true),
            update: () => Promise.resolve(true),
            split: () => Promise.resolve(true),
            selectAliasTokens: () => Promise.resolve(true),
            delete: () => Promise.resolve(true),
          },
        },
      ],
    }).compile()

    controller = module.get<DesignTokenController>(DesignTokenController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return true for create', async () => {
    expect(await controller.create(mockDesignToken)).toEqual(true)
  })

  it('should return true for split', async () => {
    expect(await controller.split(designTokenSlug, mockDesignToken)).toEqual(true)
  })

  it('should return true for update', async () => {
    expect(await controller.update(designTokenSlug, mockDesignToken)).toEqual(true)
  })

  it('should return true for selectAliasTokens', async () => {
    expect(await controller.selectAliasTokens(designTokenSlug, ['atFirst', 'atSecond'])).toEqual(
      true
    )
  })

  it('should return true for delete', async () => {
    expect(await controller.remove(designTokenSlug)).toEqual(true)
  })
})
