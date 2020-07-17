import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'wc-go-ribbon',
  buildEs5: true,
  enableCache: false,
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};
