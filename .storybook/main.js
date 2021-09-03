const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  stories: [],
  addons: ['@storybook/addon-essentials', '@storybook/addon-controls'],
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
    // Make whatever fine-grained changes you need

    // config.module.rules = config.module.rules.map((rule) => {
    //   if ('.scss'.match(rule.test)) {
    //     rule.use = rule.use.map((use) => {
    //       if (use.loader.includes('sass-loader')) {
    //         use.options = {
    //           sassOptions: {
    //             includePaths: ['libs/components/src/assets/generated'],
    //           },
    //         }
    //       }
    //       return use
    //     })
    //   }
    //   return rule
    // })

    const tsPaths = new TsconfigPathsPlugin({
      configFile: './tsconfig.base.json',
    })

    config.resolve.plugins
      ? config.resolve.plugins.push(tsPaths)
      : (config.resolve.plugins = [tsPaths])

    // Return the altered config
    return config
  },
}
