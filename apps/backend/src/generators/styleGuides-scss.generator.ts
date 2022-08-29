import { StyleGuides } from '@typings'
import { unifyColor } from '@utils'
import { writeFileSync } from 'fs'
export function styleGuidesScss(path: string, styleGuides: StyleGuides): void {
  const output = []

  for (const styleGuideKey in styleGuides) {
    const styleGuide = styleGuides[styleGuideKey]
    for (const key in styleGuide.styles) {
      const value = styleGuide.styles[key].value
      output.push({
        key: `${styleGuideKey}_${key}`,
        type: styleGuide.styles[key].type,
        value: styleGuide.styles[key].type === 'color' ? unifyColor(value) : value,
      })
    }
  }
  const attributes: string[] = []
  const mediaqueriesAttr: string[] = []
  output.forEach((attr) => {
    if (attr.type === 'mediaquery') {
      mediaqueriesAttr.push(`@mixin ${attr.key} {\n  @media ${attr.value} {\n    @content;\n  }\n}`)
    } else {
      attributes.push(`$${attr.key}: ${attr.value};`)
    }
  })
  writeFileSync(`${path}styleGuides.scss`, [...attributes, ...mediaqueriesAttr, ''].join('\n'))
}
