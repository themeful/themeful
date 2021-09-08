import { Test, TestingModule } from '@nestjs/testing'
import { AliasTokenService } from '../services/alias-token.service'
import { AliasTokenController } from './alias-token.controller'

describe('AliasTokenController', () => {
  let controller: AliasTokenController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AliasTokenController],
      providers: [{ provide: AliasTokenService, useValue: jest.mock }],
    }).compile()

    controller = module.get<AliasTokenController>(AliasTokenController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

// describe('AppController', () => {
//   let app: TestingModule

//   beforeAll(async () => {
//     app = await Test.createTestingModule({
//       controllers: [AppController],
//       providers: [AppService],
//     }).compile()
//   })

//   describe('getData', () => {
//     it('should return "Welcome to design-system!"', () => {
//       const appController = app.get<AppController>(AppController)
//       expect(appController.getData()).toEqual({
//         message: 'Welcome to design-system!',
//       })
//     })
//   })
// })
