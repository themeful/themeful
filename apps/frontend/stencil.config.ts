import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      empty: true,
    },
  ],
  plugins: [sass()],
  testing: {
    transformIgnorePatterns: ['/node_modules/(?!(date-fns|lodash-es)).+\\.js$'],
    moduleNameMapper: {
      '@properties': '<rootDir>/../../libs/property-types/src/index.ts',
      '@typings': '<rootDir>/../../libs/typings/src/index.ts',
      '@themeful-ui': '<rootDir>/../../libs/themeful-ui/src/index.ts',
      '@themeful-ui/*': '<rootDir>/../../libs/themeful-ui/src/*',
      '@utils': '<rootDir>/../../libs/utils/src/lib/index.ts',
      '@utils/*': '<rootDir>/../../libs/utils/src/lib/*',
    },
  },
}
