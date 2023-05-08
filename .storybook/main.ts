import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
export interface StorybookConfig {
  core: {
    builder: 'webpack5'
  }
  stories?: string[]
  addons: string[]
  babel?: (config: StorybookOptions) => Promise<StorybookOptions>
  babelDefault: (config: StorybookOptions) => StorybookOptions
  webpackFinal: (
    config: WebPackFinalConfig,
    options: StorybookOptions
  ) => Promise<WebPackFinalConfig>
  framework: {
    name: string
    options: {}
  }
}
export const framework = {
  name: '@storybook/html-webpack5',
  options: {},
}
export const docs = {
  autodocs: true,
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
  framework,
  addons: ['@storybook/addon-actions', '@storybook/addon-styling', '@storybook/addon-controls'],
  babelDefault: (config) => {
    return {
      ...config,
      plugins: [
        ...(config.plugins ?? []),
        [
          require.resolve('@babel/plugin-transform-react-jsx'),
          {
            pragma: 'h',
          },
          'preset',
        ],
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
