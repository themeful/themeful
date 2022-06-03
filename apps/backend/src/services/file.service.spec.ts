import { Test, TestingModule } from '@nestjs/testing'
import { clone } from '@utils'
import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
import { ConfigService } from './config.service'
import { FileService } from './file.service'
import { aliasTokens, designTokens, styleGuides, themes } from './samples'

describe('FileService', () => {
  let service: FileService

  beforeEach(async () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementation()
    jest.spyOn(fs, 'unlinkSync').mockImplementation()
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
        return {
          paths: {
            generatedPath: './sample/generated/',
            dataPath: './sample/generated/',
            themesPath: './sample/generated/',
            libPath: './sample/components/',
          },
          global: {
            baseFontSize: '16px',
            shortDesignTokens: false,
          },
        }
      } else {
        return { some: 'object' }
      }
    })

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: ConfigService,
          useValue: {
            generatedPath: './sample/generated/',
            dataPath: './sample/generated/',
            themesPath: './sample/generated/',
            libPath: './sample/components/',
            shortDesignTokens: false,
          },
        },
      ],
    }).compile()

    service = module.get<FileService>(FileService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
