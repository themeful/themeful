import { AliasTokens, DesignTokens, Themes } from '@typings'
import { writeFileSync } from 'fs'
export function designTokensScss(
  path: string,
  shortDesignTokens: boolean,
  themes: Themes,
  designTokens: DesignTokens,
  aliasTokens: AliasTokens
): void {
  const output = []
  const themeCount = Object.keys(themes).length
  const dtUsage: { [token: string]: number } = {}

  Object.values(themes).forEach((theme) => {
    Object.entries(theme.styles).forEach(([token, medias]) => {
      if (!dtUsage[token]) {
        dtUsage[token] = 0
      }
      if (dtUsage[token] >= 0 && Object.keys(medias).includes('default')) {
        dtUsage[token]++
      }
      if (!Object.keys(medias).includes('default')) {
        dtUsage[token] = -1
      }
    })
  })

  for (const designToken in designTokens) {
    for (const aliasToken of designTokens[designToken].aliasTokens) {
      output.push({
        aliasToken,
        designToken,
        key: shortDesignTokens ? designTokens[designToken].short : designToken,
      })
    }
  }

  writeFileSync(
    `${path}designTokens.scss`,
    output.reduce((result, { aliasToken, designToken, key }) => {
      if (!dtUsage[designToken]) {
        if (aliasTokens[aliasToken] && aliasTokens[aliasToken].default) {
          return `${result}$${aliasToken}: ${aliasTokens[aliasToken].default};\n`
        }
        return result
      }
      if (
        (dtUsage[designToken] === -1 || dtUsage[designToken] < themeCount) &&
        aliasTokens[aliasToken] &&
        aliasTokens[aliasToken].default
      ) {
        return `${result}$${aliasToken}: var(--${key}, ${aliasTokens[aliasToken].default});\n`
      }
      return `${result}$${aliasToken}: var(--${key});\n`
    }, '')
  )
}
