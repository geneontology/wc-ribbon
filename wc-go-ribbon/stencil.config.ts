import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'wc-go-ribbon',
  buildEs5: true,
  // bundles: [
  //   { components: ['wc-go-ribbon', 'wc-ribbon-strips', 'wc-ribbon-table', 'wc-spinner']}
  // ],
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
