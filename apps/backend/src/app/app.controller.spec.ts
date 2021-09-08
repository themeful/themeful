import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'

describe('AppController', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
    }).compile()
  })

  describe('getData', () => {
    it('should return "Welcome to design-system!"', () => {
      const appController = app.get<AppController>(AppController)
      expect(appController.getData()).toBeTruthy()
    })
  })
})
