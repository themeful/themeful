import { Test, TestingModule } from '@nestjs/testing'
import { StyleGuideBase } from '@typings'
import { StyleGuideService } from '../services/style-guide.service'
import { StyleGuideController } from './style-guide.controller'

describe('StyleGuideController', () => {
  let controller: StyleGuideController
  const mockStyleGuideBase = { some: 'object' } as unknown as StyleGuideBase
  const styleGuideSlug = 'some_sliug'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StyleGuideController],
      providers: [
        {
          provide: StyleGuideService,
          useValue: {
            createStyleGuide: () => Promise.resolve(true),
            duplicate: () => Promise.resolve(true),
            updateStyleGuide: () => Promise.resolve(true),
            deleteStyleGuide: () => Promise.resolve(true),
          },
        },
      ],
    }).compile()

    controller = module.get<StyleGuideController>(StyleGuideController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return true for create', async () => {
    expect(await controller.create(mockStyleGuideBase)).toEqual(true)
  })

  it('should return true for rescan', async () => {
    expect(await controller.duplicate(styleGuideSlug, mockStyleGuideBase)).toEqual(true)
  })

  it('should return true for update', async () => {
    expect(await controller.update(styleGuideSlug, mockStyleGuideBase)).toEqual(true)
  })

  it('should return true for delete', async () => {
    expect(await controller.remove(styleGuideSlug)).toEqual(true)
  })
})
