import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'

export default [
  {
    input: './src/index.jsx',
    output: {
      dir: './dist',
      format: 'cjs',
      exports: 'default'
    },
    external: [
      'react',
      'next-mdx-remote',
      'mdx-observable',
      'react-scroll',
      'fs',
      'path'
    ],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          '@babel/env',
          [
            '@babel/preset-react',
            {
              runtime: 'automatic'
            }
          ]
        ]
      })
    ]
  },
  {
    input: './src/serialize.js',
    output: {
      dir: './dist',
      format: 'cjs'
    },
    external: ['@mdx-js/mdx', 'esbuild', 'pkg-dir'],
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      })
    ]
  }
]
