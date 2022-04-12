import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { Style } from '@typings'
import { StyleGuideService } from '../services/style-guide.service'

@Controller('style')
export class StyleController {
  constructor(private readonly styleGuideService: StyleGuideService) {}

  @Post()
  create(@Body() data: Style) {
    return this.styleGuideService.create(data)
  }

  @Post(':styleGuide')
  createWithClient(@Body() data: Style, @Param('styleGuide') styleGuide: string) {
    return this.styleGuideService.create(data, styleGuide)
  }

  @Get('formatted')
  readFormatted() {
    return this.styleGuideService.readFormatted()
  }

  @Get()
  read() {
    return this.styleGuideService.read()
  }

  @Patch(':key')
  update(@Param('key') key: string, @Body() data: Style) {
    return this.styleGuideService.update(key, data)
  }

  @Patch(':key/:styleGuide')
  updateClient(
    @Param('key') key: string,
    @Param('styleGuide') styleGuide: string,
    @Body() data: Style
  ) {
    return this.styleGuideService.update(key, data, styleGuide)
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.styleGuideService.delete(key)
  }

  @Delete(':key/:styleGuide')
  removeWithClient(@Param('key') key: string, @Param('styleGuide') styleGuide: string) {
    return this.styleGuideService.delete(key, styleGuide)
  }
}
