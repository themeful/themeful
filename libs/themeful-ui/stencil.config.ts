import { Config } from '@stencil/core'
import { postcss } from '@stencil/postcss'
import { sass } from '@stencil/sass'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

export const config: Config = {
  namespace: 'themeful-ui',
  taskQueue: 'async',
  plugins: [
    sass(),
    postcss({
      plugins: [autoprefixer(), cssnano()],
    }),
  ],
  globalStyle: `src/global.scss`,
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      dir: '../../dist/libs/themeful-ui/dist',
    },
    {
      type: 'www',
      dir: '../../dist/libs/themeful-ui/www',
      serviceWorker: null,
    },
  ],
  testing: {
    transformIgnorePatterns: ['/node_modules/(?!(date-fns|lodash-es)).+\\.js$'],
    moduleNameMapper: {
      '@properties': '<rootDir>/../property-types/src/index.ts',
      '@typings': '<rootDir>/../typings/src/index.ts',
      '@utils': '<rootDir>/../utils/src/lib/index.ts',
      '@utils/*': '<rootDir>/../utils/src/lib/*',
    },
  },
}
