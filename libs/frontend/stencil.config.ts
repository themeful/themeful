import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

export const config: Config = {
  namespace: 'frontend',
  taskQueue: 'async',
  plugins: [sass()],
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
