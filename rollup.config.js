import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import bundlesize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';
import pkg from '../package.json';
const MAIN = 'src/index.js';

export default [
  {
    input: MAIN,
    output: {
      file: 'build/index.js',
      format: 'cjs',
    },
    external: {
      ...pkg.dependencies,
      ...pkg.peerDependencies,
    },
    plugins: [
      resolve(),
      babel({
        // babelHelpers: 'runtime',
        // plugins: ['@babel/plugin-transform-runtime'],
      }),
      bundlesize(),
      terser(),
    ],
  },
];
