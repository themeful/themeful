import { Test, TestingModule } from '@nestjs/testing'
import { AliasTokenAPI } from '@typings'
import { AliasTokenService } from '../services/alias-token.service'
import { AliasTokenController } from './alias-token.controller'

describe('AliasTokenController', () => {
  let controller: AliasTokenController
  const mockAliasToken = { some: 'object' } as unknown as AliasTokenAPI
  const aliasTokenSlug = 'atTestToken'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AliasTokenController],
      providers: [
        {
          provide: AliasTokenService,
          useValue: {
            create: () => Promise.resolve(true),
            refresh: () => Promise.resolve(true),
            update: () => Promise.resolve(true),
            delete: () => Promise.resolve(true),
          },
        },
      ],
    }).compile()

    controller = module.get<AliasTokenController>(AliasTokenController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return true for create', async () => {
    expect(await controller.create(mockAliasToken)).toEqual(true)
  })

  it('should return true for rescan', async () => {
    expect(await controller.rescan()).toEqual(true)
  })

  it('should return true for update', async () => {
    expect(await controller.update(aliasTokenSlug, mockAliasToken)).toEqual(true)
  })

  it('should return true for delete', async () => {
    expect(await controller.remove(aliasTokenSlug)).toEqual(true)
  })
})
