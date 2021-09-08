import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { DesignToken } from '@typings'

import { DesignTokenService } from '../services/design-token.service'

@Controller('design-token')
export class DesignTokenController {
  constructor(private readonly designTokenService: DesignTokenService) {}

  @Post()
  create(@Body() designToken: DesignToken) {
    return this.designTokenService.create(designToken)
  }

  @Get()
  read() {
    return this.designTokenService.read()
  }

  @Patch(':token')
  update(@Param('token') token: string, @Body() designToken: DesignToken) {
    return this.designTokenService.update(token, designToken)
  }

  @Patch(':token/aliasTokens')
  selectAliasTokens(@Param('token') token: string, @Body() aliasTokens: string[]) {
    return this.designTokenService.selectAliasTokens(token, aliasTokens)
  }

  @Delete(':token')
  remove(@Param('token') token: string) {
    return this.designTokenService.delete(token)
  }
}
