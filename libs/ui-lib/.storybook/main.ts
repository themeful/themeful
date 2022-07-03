import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { rootMain, StorybookOptions, WebPackFinalConfig } from '../../../.storybook/main'

module.exports = {
  ...rootMain,

  core: { ...rootMain.core },

  stories: [...rootMain.stories, '../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [...(rootMain.addons ?? [])],
  babel: async (options: StorybookOptions) => ({
    ...options,
    presets: [['@babel/typescript', { jsxPragma: 'h' }]],
  }),
  webpackFinal: async (config: WebPackFinalConfig, options: StorybookOptions) => {
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, options)
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
