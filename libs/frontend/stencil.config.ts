import { Config } from '@stencil/core'
import { postcss } from '@stencil/postcss'
import { sass } from '@stencil/sass'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

export const config: Config = {
  namespace: 'frontend',
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
      dir: '../../dist/libs/frontend/dist',
    },
    {
      type: 'www',
      dir: '../../dist/libs/frontend/www',
      serviceWorker: null,
    },
  ],
}
