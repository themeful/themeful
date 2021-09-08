import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { Theme } from '@typings'

import { ThemeService } from '../services/theme.service'

@Controller('theme')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Post()
  create(@Body() theme: Theme) {
    return this.themeService.create(theme)
  }

  @Get()
  read() {
    return this.themeService.read()
  }

  @Patch(':key')
  update(@Param('key') key: string, @Body() theme: Theme) {
    return this.themeService.update(key, theme)
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.themeService.delete(key)
  }

  @Post('value/:theme/:token')
  createValue(@Param('theme') theme: string, @Param('token') token: string, @Body() value: any) {
    return this.themeService.createValue(theme, token, value)
  }

  @Patch('value/:theme/:token/:media')
  updateValue(
    @Param('theme') theme: string,
    @Param('token') token: string,
    @Param('media') media: string,
    @Body() value: any
  ) {
    return this.themeService.updateValue(theme, token, media, value)
  }

  @Delete('value/:theme/:token/:media')
  removeValue(
    @Param('theme') theme: string,
    @Param('token') token: string,
    @Param('media') media: string
  ) {
    return this.themeService.deleteValue(theme, token, media)
  }
}
