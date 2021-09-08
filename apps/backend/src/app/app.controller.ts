import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getData() {
    return {
      urls: [
        'http://localhost:3333/api/alias-token',
        'http://localhost:3333/api/design-token',
        'http://localhost:3333/api/theme',
        'http://localhost:3333/api/base-value',
      ],
    }
  }
}
