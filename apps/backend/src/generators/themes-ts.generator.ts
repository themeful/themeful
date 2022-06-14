import { StyleGuides, Themes } from '@typings'
import { slugify } from '@utils'
import { writeFileSync } from 'fs'

export function themesTs(path: string, themes: Themes, styleGuides: StyleGuides): void {
  const styleGuideNames: { [key: string]: string } = {}
  Object.keys(styleGuides).forEach((styleGuide) => {
    styleGuideNames[styleGuide] = styleGuides[styleGuide].name
  })
  let tsFile = 'export const themes = [\n'
  for (const key in themes) {
    if (styleGuideNames[themes[key].styleGuide]) {
      const name = `${styleGuideNames[themes[key].styleGuide]} - ${themes[key].name}`
      tsFile += `  { name: '${name}', slug: '${slugify([
        themes[key].styleGuide,
        themes[key].name,
      ])}' },\n`
    }
  }
  tsFile = `${tsFile}]\n`
  writeFileSync(`${path}themes.ts`, tsFile)
}
