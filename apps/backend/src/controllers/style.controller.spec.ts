import { Test, TestingModule } from '@nestjs/testing'
import { Style } from '@typings'
import { StyleGuideService } from '../services/style-guide.service'
import { StyleController } from './style.controller'

describe('StyleController', () => {
  let controller: StyleController
  const mockStyle = { some: 'object' } as unknown as Style
  const styleSlug = 'some_slug'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StyleController],
      providers: [
        {
          provide: StyleGuideService,
          useValue: {
            create: () => Promise.resolve(true),
            update: () => Promise.resolve(true),
            delete: () => Promise.resolve(true),
          },
        },
      ],
    }).compile()

    controller = module.get<StyleController>(StyleController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return true for createStyle', async () => {
    expect(await controller.create(mockStyle)).toEqual(true)
  })

  it('should return true for createStyleWithStyleGuide', async () => {
    expect(await controller.createWithClient(mockStyle, 'styleGuideTest')).toEqual(true)
  })

  it('should return true for updateStyle', async () => {
    expect(await controller.update(styleSlug, mockStyle)).toEqual(true)
  })

  it('should return true for updateStyleWithStyleGuide', async () => {
    expect(await controller.updateClient(styleSlug, 'styleGuideTest', mockStyle)).toEqual(true)
  })

  it('should return true for deleteStyle', async () => {
    expect(await controller.remove(styleSlug)).toEqual(true)
  })

  it('should return true for deleteStyleWithStyleGuide', async () => {
    expect(await controller.removeWithClient(styleSlug, 'styleGuideTest')).toEqual(true)
  })
})
