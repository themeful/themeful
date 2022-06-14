import { Test, TestingModule } from '@nestjs/testing'
import { MediaValueDetail, Theme } from '@typings'

import { ThemeService } from '../services/theme.service'
import { ThemeController } from './theme.controller'

describe('ThemeController', () => {
  let controller: ThemeController
  const mockTheme = { some: 'object' } as unknown as Theme
  const mockThemeValue = { some: 'object' } as unknown as MediaValueDetail
  const themeSlug = 'some_slug'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThemeController],
      providers: [
        {
          provide: ThemeService,
          useValue: {
            create: () => Promise.resolve(true),
            update: () => Promise.resolve(true),
            duplicate: () => Promise.resolve(true),
            delete: () => Promise.resolve(true),
            createValue: () => Promise.resolve(true),
            updateValue: () => Promise.resolve(true),
            deleteValue: () => Promise.resolve(true),
          },
        },
      ],
    }).compile()

    controller = module.get<ThemeController>(ThemeController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return true for create', async () => {
    expect(await controller.create(mockTheme)).toEqual(true)
  })

  it('should return true for duplicate', async () => {
    expect(await controller.duplicate(themeSlug, { name: 'some_slug' })).toEqual(true)
  })

  it('should return true for update', async () => {
    expect(await controller.update(themeSlug, mockTheme)).toEqual(true)
  })

  it('should return true for delete', async () => {
    expect(await controller.remove(themeSlug)).toEqual(true)
  })

  it('should return true for createValue', async () => {
    expect(await controller.createValue(themeSlug, 'design_token', mockThemeValue)).toEqual(true)
  })

  it('should return true for updateValue', async () => {
    expect(
      await controller.updateValue(themeSlug, 'design_token', 'media_token', mockThemeValue)
    ).toEqual(true)
  })

  it('should return true for deleteValue', async () => {
    expect(await controller.removeValue(themeSlug, 'design_token', 'media_token')).toEqual(true)
  })
})
