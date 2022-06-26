import { StyleGuides, Themes } from '@typings'
import { slugify } from '@utils'
import { writeFileSync } from 'fs'

export function themesTs(path: string, themes: Themes, styleGuides: StyleGuides): void {
  const styleGuideNames: { [key: string]: string } = {}
  Object.keys(styleGuides).forEach((styleGuide) => {
    styleGuideNames[styleGuide] = styleGuides[styleGuide].name
  })
  const styleGuideCount: { [styleGuide: string]: number } = {}
  Object.values(themes).forEach(({ styleGuide }) => {
    styleGuideCount[styleGuide] = (styleGuideCount[styleGuide] || 0) + 1
  })
  let tsFile = 'export const themes = [\n'
  for (const key in themes) {
    if (styleGuideNames[themes[key].styleGuide]) {
      let name = styleGuideNames[themes[key].styleGuide]
      if (styleGuideCount[themes[key].styleGuide] > 1) {
        name += ` - ${themes[key].name}`
      }
      tsFile += `  { name: '${name}', slug: '${slugify([
        themes[key].styleGuide,
        themes[key].name,
      ])}' },\n`
    }
  }
  tsFile = `${tsFile}]\n`
  writeFileSync(`${path}themes.ts`, tsFile)
}
