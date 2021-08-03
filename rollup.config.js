import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import bundlesize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';
const MAIN = 'src/index.js';

const COMMON = {
  external: {
    ...pkg.dependencies,
    ...pkg.peerDependencies,
  },
  plugins: [resolve(), babel(), bundlesize(), terser()],
};

const schema = (name) => ({
  input: `src/schemas/${name}/index.js`,
  output: {
    file: `build/schemas/${name}.js`,
    format: 'cjs',
    exports: 'default',
  },
  ...COMMON,
});

export default [
  {
    input: MAIN,
    output: {
      file: 'build/index.js',
      format: 'cjs',
    },
    ...COMMON,
  },
  schema('mixed'),
  schema('boolean'),
  schema('number'),
  schema('string'),
  schema('date'),
  schema('object'),
  schema('array'),
];
