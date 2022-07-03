import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

export interface StorybookConfig {
  core: {
    builder: 'webpack5'
  }
  stories: string[]
  addons: string[]
  babel?: (config: StorybookOptions) => Promise<StorybookOptions>
  babelDefault: (config: StorybookOptions) => StorybookOptions
  webpackFinal: (
    config: WebPackFinalConfig,
    options: StorybookOptions
  ) => Promise<WebPackFinalConfig>
}

export interface WebPackFinalConfig {
  resolve: {
    plugins: TsconfigPathsPlugin[]
  }
}

export interface StorybookOptions {
  plugins?: any[]
  presets: any[]
}

export const rootMain: StorybookConfig = {
  core: {
    builder: 'webpack5',
  },
  stories: [],
  addons: ['@storybook/addon-essentials', '@storybook/addon-actions', '@storybook/addon-postcss'],
  babelDefault: (config) => {
    return {
      ...config,
      plugins: [
        ...(config.plugins ?? []),
        [require.resolve('@babel/plugin-transform-react-jsx'), { pragma: 'h' }, 'preset'],
      ],
    }
  },
  webpackFinal: async (config, _options) => {
    const tsPaths = new TsconfigPathsPlugin({
      configFile: './tsconfig.base.json',
    })

    config.resolve.plugins
      ? config.resolve.plugins.push(tsPaths)
      : (config.resolve.plugins = [tsPaths])

    return config
  },
}
