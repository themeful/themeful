const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: [],
  addons: ['@storybook/addon-essentials', '@storybook/addon-actions', '@storybook/addon-postcss'],
  babelDefault: (config) => {
    return {
      ...config,
      plugins: [
        ...config.plugins,
        [require.resolve('@babel/plugin-transform-react-jsx'), { pragma: 'h' }, 'preset'],
      ],
    }
  },
  webpackFinal: async (config, { configType }) => {
    const tsPaths = new TsconfigPathsPlugin({
      configFile: './tsconfig.base.json',
    })

    config.resolve.plugins
      ? config.resolve.plugins.push(tsPaths)
      : (config.resolve.plugins = [tsPaths])

    return config
  },
}
