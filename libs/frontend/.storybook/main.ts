import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'
import { rootMain } from '../../../.storybook/main'

export default {
  ...rootMain,

  core: { ...rootMain.core },

  stories: [...rootMain.stories, '../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [...rootMain.addons],
  webpackFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType })
    }
    const tsPaths = new TsconfigPathsPlugin({
      configFile: './tsconfig.base.json',
    })

    config.resolve.plugins
      ? config.resolve.plugins.push(tsPaths)
      : (config.resolve.plugins = [tsPaths])

    return config
  },
}
