import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from './config.service'

describe('ConfigService', () => {
  let service: ConfigService
  const config = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile()

    config['paths'] = {
      generatedPath: 'test/generatedPath',
      dataPath: 'test/dataPath',
      themesPath: 'test/themesPath',
      libPath: 'test/libPath',
    }

    config['global'] = {
      baseFontSize: '16px',
      shortDesignTokens: false,
    }

    service = module.get<ConfigService>(ConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should generatedPath defined', () => {
    expect(service.generatedPath).toEqual('test/generatedPath')
  })

  it('should dataPath defined', () => {
    expect(service.dataPath).toEqual('test/dataPath')
  })

  it('should themesPath defined', () => {
    expect(service.themesPath).toEqual('test/themesPath')
  })

  it('should libPath defined', () => {
    expect(service.libPath).toEqual('test/libPath')
  })
})
