import { Test, TestingModule } from '@nestjs/testing'
import * as generators from '../generators'
import { GeneratorService } from './generator.service'

describe('GeneratorService', () => {
  let service: GeneratorService

  beforeEach(async () => {
    jest.spyOn(generators, 'designTokensScss').mockImplementation()
    jest.spyOn(generators, 'styleGuidesScss').mockImplementation()
    jest.spyOn(generators, 'themesScss').mockImplementation()
    jest.spyOn(generators, 'themesTs').mockImplementation()

    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratorService],
    }).compile()

    service = module.get<GeneratorService>(GeneratorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
