import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { BaseValue } from '@typings'

import { BaseValueService } from '../services/base-value.service'

@Controller('base-value')
export class BaseValueController {
  constructor(private readonly baseValueService: BaseValueService) {}

  @Post()
  create(@Body() data: BaseValue) {
    return this.baseValueService.create(data)
  }

  @Post(':client')
  createWithClient(@Body() data: BaseValue, @Param('client') client: string) {
    return this.baseValueService.create(data, client)
  }

  @Get()
  read() {
    return this.baseValueService.read()
  }

  @Patch(':key')
  update(@Param('key') key: string, @Body() data: BaseValue) {
    return this.baseValueService.update(key, data)
  }

  @Patch(':key/:client')
  updateClient(
    @Param('key') key: string,
    @Param('client') client: string,
    @Body() data: BaseValue
  ) {
    return this.baseValueService.update(key, data, client)
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.baseValueService.delete(key)
  }

  @Delete(':key/:client')
  removeWithClient(@Param('key') key: string, @Param('client') client: string) {
    return this.baseValueService.delete(key, client)
  }
}
