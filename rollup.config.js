import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sourcemaps from 'rollup-plugin-sourcemaps';
import bundlesize from 'rollup-plugin-bundle-size';
import { babel } from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    {
      sourcemap: true,
      file: 'build/bundle.min.js',
      format: 'iife',
      name: 'schema2',
      plugins: [bundlesize(), terser()],
    },
  ],
  plugins: [nodeResolve(), babel({ babelHelpers: 'bundled' }), sourcemaps()],
};
