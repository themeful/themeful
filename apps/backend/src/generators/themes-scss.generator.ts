import { DesignTokens, Style, StyleGuides, Themes } from '@typings'
import { slugify } from '@utils'
import { readdirSync, unlinkSync, writeFileSync } from 'fs'
import * as smq from 'sort-media-queries'

export function themesScss(
  path: string,
  shortDesignTokens: boolean,
  themes: Themes,
  designTokens: DesignTokens,
  styleGuides: StyleGuides
): void {
  let storybookThemes = ''
  const themeList = []

  const mediaQueryMap: { media: string; key: string }[] = []

  Object.entries(styleGuides).forEach(([slug, styleGuide]) => {
    mediaQueryMap.push(
      ...Object.entries(styleGuide.styles)
        .filter(([, item]: [string, Style]) => item.type === 'mediaquery')
        .map(([key, item]: [string, Style]) => ({ media: item.value, key: `${slug}_${key}` }))
    )
  })

  const mediaQueryOrder = smq(mediaQueryMap, 'media').map(({ key }) => key)
  for (const key in themes) {
    if (!styleGuides[themes[key].styleGuide]) {
      continue
    }
    storybookThemes += `html[data-brand-theme='${key}'] {\n  @import './theme_${key}';\n}\n`
    const baseFontSize = styleGuides[themes[key].styleGuide].baseFontSize
    const baseFontSizeStr =
      baseFontSize === 16 ? '' : `body {\n  font-size: ${baseFontSize}px;\n}\n\n`
    let scssFile = `@import './styleGuides.scss';\n\n${baseFontSizeStr}& {\n`
    const mediaQueries: { [key: string]: string[] } = {}
    for (const designToken in themes[key].styles) {
      const renderedToken = shortDesignTokens ? designTokens[designToken].short : designToken
      if (themes[key].styles[designToken]) {
        Object.keys(themes[key].styles[designToken]).forEach((media) => {
          if (media === 'default') {
            scssFile +=
              `  --${renderedToken}: ` +
              (themes[key].styles[designToken].default.style
                ? `#{$${themes[key].styles[designToken].default.style}};\n`
                : `${themes[key].styles[designToken].default.direct.value};\n`)
          } else {
            mediaQueries[media] = mediaQueries[media] ?? []
            mediaQueries[media].push(
              themes[key].styles[designToken][media].style
                ? `--${renderedToken}: #{$${themes[key].styles[designToken][media].style}};`
                : `--${renderedToken}: ${themes[key].styles[designToken][media].direct.value};`
            )
          }
        })
      }
    }

    const sorted: { [key: string]: string[] } = {}
    mediaQueryOrder.forEach((mq) => {
      if (mediaQueries[mq]) {
        sorted[mq] = mediaQueries[mq]
      }
    })

    scssFile +=
      Object.entries(sorted).reduce((result, [media, values]) => {
        return `${result}  @include ${media} {\n    ${values.join('\n    ')}\n  }\n`
      }, '') + '}\n'
    const themeSlug = slugify([themes[key].styleGuide, themes[key].name])
    themeList.push(themeSlug)
    writeFileSync(`${path}theme_${themeSlug}.scss`, scssFile)
  }
  writeFileSync(`${path}themes.scss`, storybookThemes)
  readdirSync(path).forEach((file) => {
    if (/^theme_.*.scss$/.test(file)) {
      const match = file.match(/^theme_(.*).scss$/)
      if (match[1] && !themeList.includes(match[1])) {
        unlinkSync(`${path}${file}`)
      }
    }
  })
}
