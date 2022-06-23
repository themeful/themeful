import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

export const rootMain = {
  core: {
    builder: 'webpack5',
  },
  stories: [],
  addons: ['@storybook/addon-essentials', '@storybook/addon-actions', '@storybook/addon-postcss'],
  babelDefault: (config: any) => {
    return {
      ...config,
      plugins: [
        ...config.plugins,
        [require.resolve('@babel/plugin-transform-react-jsx'), { pragma: 'h' }, 'preset'],
      ],
    }
  },
  webpackFinal: async (config: any, { configType }: { configType: any }) => {
    const tsPaths = new TsconfigPathsPlugin({
      configFile: './tsconfig.base.json',
    })

    config.resolve.plugins
      ? config.resolve.plugins.push(tsPaths)
      : (config.resolve.plugins = [tsPaths])

    return config
  },
}
