import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs';

const env = process.env.NODE_ENV

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/main.js',
    format: 'umd',
    name: 'GraphiQLPlugins',
    exports: 'named',
    globals: {
      react: 'React',
    },
  },
  external: [
    'react',
    'react-proptypes'
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    commonjs()
  ]
};
