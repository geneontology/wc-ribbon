import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export const config: Config = {
  namespace: 'wc-go-ribbon',
  rollupPlugins: {
    after: [
      nodePolyfills(),
    ]
  },
  buildEs5: true,
  // bundles: [
  //   { components: ['wc-go-ribbon', 'wc-ribbon-strips', 'wc-ribbon-table', 'wc-spinner']}
  // ],
  enableCache: false,
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
