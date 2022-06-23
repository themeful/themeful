import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { rootMain } from '../../../.storybook/main'

module.exports = {
  ...rootMain,

  core: { ...rootMain.core },

  stories: [...rootMain.stories, '../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [...rootMain.addons],
  babel: async (options: any) => ({
    ...options,
    presets: [['@babel/typescript', { jsxPragma: 'h' }]],
  }),
  webpackFinal: async (config: any, { configType }: { configType: any }) => {
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
