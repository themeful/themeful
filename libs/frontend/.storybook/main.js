const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const rootMain = require('../../../.storybook/main')
const path = require('path');

module.exports = {
  ...rootMain,

  core: { ...rootMain.core },

  stories: [...rootMain.stories, '../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [...rootMain.addons],
  babel: async options => ({
    ...options,
    presets: [["@babel/typescript", { jsxPragma: "h" }]],
  }),
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });
    
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
