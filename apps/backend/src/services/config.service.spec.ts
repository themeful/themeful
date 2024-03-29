import { Test, TestingModule } from '@nestjs/testing'
import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
import { ConfigService } from './config.service'

const config = {
  paths: {
    generatedPath: 'test/generatedPath',
    dataPath: 'test/dataPath/',
    themesPath: 'test/themesPath',
    libPaths: ['./test-sample/components/one-lib', './test-sample/components/other-lib/'],
  },
  global: {
    baseFontSize: 16,
    shortDesignTokens: false,
  },
}

describe('ConfigService', () => {
  let service: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile()
    jest.spyOn(jsonfile, 'writeFileSync').mockImplementation()
    jest.spyOn(jsonfile, 'readFileSync').mockImplementation(() => config)
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false)

    service = module.get<ConfigService>(ConfigService)
  })

  describe('with existing config file', () => {
    it('should be defined', () => {
      expect(service).toBeDefined()
    })

    it('should generatedPath defined', () => {
      expect(service.generatedPath).toEqual('test/generatedPath/')
    })

    it('should dataPath defined', () => {
      expect(service.dataPath).toEqual('test/dataPath/')
    })

    it('should themesPath defined', () => {
      expect(service.themesPath).toEqual('test/themesPath/')
    })

    it('should libPaths defined', () => {
      expect(service.libPaths).toEqual([
        './test-sample/components/one-lib/',
        './test-sample/components/other-lib/',
      ])
    })

    it('should return shortDesignTokens', () => {
      expect(service.shortDesignTokens).toEqual(false)
    })

    it('should return baseFontSize', () => {
      expect(service.baseFontSize).toEqual(16)
    })
  })
})

describe('ConfigService without config file', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile()
    jest.spyOn(jsonfile, 'writeFileSync').mockImplementation()
    jest.spyOn(jsonfile, 'readFileSync').mockImplementation(() => config)
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false)

    module.get<ConfigService>(ConfigService)
  })

  describe('without config file', () => {
    it('should create new config file', () => {
      expect(fs.existsSync).toBeCalledWith('themeful.json')
      expect(jsonfile.writeFileSync).toHaveBeenCalledWith(
        'themeful.json',
        {
          global: { baseFontSize: 16, shortDesignTokens: false },
          paths: {
            dataPath: './sample/generated/',
            generatedPath: './sample/generated/',
            libPaths: ['./test-sample/first-lib/', './test-sample/second-lib/'],
            themesPath: './sample/generated/',
          },
        },
        { spaces: 2 }
      )
      expect(jsonfile.readFileSync).toBeCalledWith('themeful.json')
    })
  })
})
