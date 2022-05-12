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
}
