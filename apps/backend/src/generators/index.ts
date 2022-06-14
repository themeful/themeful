import { designTokensScss } from './designTokens-scss.generator'
import { styleGuidesScss } from './styleGuides-scss.generator'
import { themesScss } from './themes-scss.generator'
import { themesTs } from './themes-ts.generator'

const generators = {
  designTokensScss,
  styleGuidesScss,
  themesScss,
  themesTs,
}

export default generators

export { designTokensScss, styleGuidesScss, themesScss, themesTs }
