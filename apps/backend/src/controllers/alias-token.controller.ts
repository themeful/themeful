import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { AliasToken } from '@typings'

import { AliasTokenService } from '../services/alias-token.service'

@Controller('alias-token')
export class AliasTokenController {
  constructor(private readonly aliasTokenService: AliasTokenService) {}

  @Post()
  create(@Body() aliasToken: AliasToken) {
    return this.aliasTokenService.create(aliasToken)
  }

  @Get()
  read() {
    return this.aliasTokenService.read()
  }

  @Get('rescan')
  rescan() {
    return this.aliasTokenService.refresh()
  }

  @Patch(':token')
  update(@Param('token') token: string, @Body() aliasToken: AliasToken) {
    return this.aliasTokenService.update(token, aliasToken)
  }

  @Delete(':token')
  remove(@Param('token') token: string) {
    return this.aliasTokenService.delete(token)
  }
}
