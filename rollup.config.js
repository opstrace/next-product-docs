import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'

// eslint-disable-next-line no-unused-vars
const extensions = ['.js', '.jsx']

export default [
  {
    input: './src/index.jsx',
    output: {
      dir: './dist',
      format: 'es'
    },
    external: [
      'react',
      'next-mdx-remote',
      'react-copy-to-clipboard',
      'fs',
      'path'
    ],
    plugins: [
      resolve(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/env', '@babel/preset-react']
      })
    ]
  },
  {
    input: './src/serialize.js',
    output: {
      dir: './dist',
      format: 'es'
    },
    external: ['@mdx-js/mdx', 'esbuild'],
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs(),
      babel({
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: 'current'
              }
            }
          ],
          '@babel/preset-react'
        ],
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      })
    ]
  }
]
