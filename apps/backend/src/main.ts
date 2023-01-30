import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MainModule } from './main.module'

async function bootstrap() {
  const app = await NestFactory.create(MainModule, { cors: true })
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  const port = process.env['PORT'] || 7333
  await app.listen(port, () => {
    Logger.log('API listening at http://localhost:' + port + '/' + globalPrefix)
    Logger.log('Themeful Frontend at http://localhost:' + port + '/')
  })
}

bootstrap()
