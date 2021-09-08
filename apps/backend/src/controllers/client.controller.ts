import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common'
import { Client } from '@typings'

import { BaseValueService } from '../services/base-value.service'

@Controller('client')
export class ClientController {
  constructor(private readonly baseValueService: BaseValueService) {}

  @Post()
  create(@Body() data: Client) {
    return this.baseValueService.createClient(data)
  }

  @Patch(':client')
  update(@Param('client') client: string, @Body() data: Client) {
    return this.baseValueService.updateClient(client, data)
  }

  @Delete(':client')
  remove(@Param('client') client: string) {
    return this.baseValueService.deleteClient(client)
  }
}
