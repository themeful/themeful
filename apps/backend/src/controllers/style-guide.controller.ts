import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common'
import { StyleGuideBase } from '@typings'
import { StyleGuideService } from '../services/style-guide.service'

@Controller('style-guide')
export class StyleGuideController {
  constructor(private readonly styleGuideService: StyleGuideService) {}

  @Post()
  create(@Body() data: StyleGuideBase) {
    return this.styleGuideService.createStyleGuide(data)
  }

  @Patch(':styleGuide')
  update(@Param('styleGuide') styleGuide: string, @Body() data: StyleGuideBase) {
    return this.styleGuideService.updateStyleGuide(styleGuide, data)
  }

  @Delete(':styleGuide')
  remove(@Param('styleGuide') styleGuide: string) {
    return this.styleGuideService.deleteStyleGuide(styleGuide)
  }
}
