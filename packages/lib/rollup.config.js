import json from '@rollup/plugin-json';
import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
  // {
  //   input: 'src/index.js',
  //   output: {
  //     name: pkg.main,
  //     file: pkg.browser,
  //     format: 'umd',
  //     plugins: [ json(), terser() ]
  //   },
  // },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.js',
    output: [
      // { 
      //   file: pkg.main,
      //   format: 'cjs',
      // },
      {
        file: pkg.main,
        format: 'es',
      },
    ],
  }
]