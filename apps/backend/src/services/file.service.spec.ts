import { Test, TestingModule } from '@nestjs/testing'
import { clone } from '@utils'
import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
import { combineLatest } from 'rxjs'
import { ConfigService } from './config.service'
import { FileService } from './file.service'
import { GeneratorService } from './generator.service'
import { aliasTokens, config, designTokens, styleGuides, themes } from './samples.mock'
import { mockConfigService } from './service.mock'

describe('FileService', () => {
  let service: FileService
  let generator: GeneratorService

  beforeEach(async () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementation()
    jest.spyOn(fs, 'unlinkSync').mockImplementation()
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest.spyOn(jsonfile, 'writeFileSync').mockImplementation()
    jest.spyOn(jsonfile, 'readFileSync').mockImplementation((filename: string) => {
      if (filename.includes('themes')) {
        return clone(themes)
      } else if (filename.includes('designTokens')) {
        return clone(designTokens)
      } else if (filename.includes('aliasTokens')) {
        return clone(aliasTokens)
      } else if (filename.includes('styleGuides')) {
        return clone(styleGuides)
      } else if (filename.includes('themeful.json')) {
        return clone(config)
      } else {
        return { some: 'object' }
      }
    })

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: GeneratorService,
          useValue: {
            themesTs: jest.fn(),
            themesScss: jest.fn(),
            styleGuidesScss: jest.fn(),
            designTokensScss: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile()

    service = module.get<FileService>(FileService)
    generator = module.get<GeneratorService>(GeneratorService)
    jest.spyOn(generator, 'designTokensScss')
    jest.spyOn(generator, 'styleGuidesScss')
    jest.spyOn(generator, 'themesScss')
    jest.spyOn(generator, 'themesTs')
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return themes', (done) => {
    service.themes$().subscribe((result) => {
      expect(result).toEqual(themes)
      done()
    })
  })

  it('should return designTokens', (done) => {
    service.designTokens$().subscribe((result) => {
      expect(result).toEqual(designTokens)
      done()
    })
  })

  it('should return aliasTokens', (done) => {
    service.aliasTokens$().subscribe((result) => {
      expect(result).toEqual(aliasTokens)
      done()
    })
  })

  it('should return styleGuides', (done) => {
    service.styleGuides$().subscribe((result) => {
      expect(result).toEqual(styleGuides)
      done()
    })
  })

  it('should return config', (done) => {
    service.config$().subscribe((result) => {
      expect(result).toEqual({ baseFontSize: '16px', shortDesignTokens: false })
      done()
    })
  })

  it('should call generators', (done) => {
    combineLatest([
      service.themes$(),
      service.designTokens$(),
      service.aliasTokens$(),
      service.styleGuides$(),
    ]).subscribe(() => {
      done()
    })
  })
})
