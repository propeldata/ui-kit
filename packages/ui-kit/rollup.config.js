const commonjs = require('@rollup/plugin-commonjs')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const terser = require('@rollup/plugin-terser')
const postcss = require('rollup-plugin-postcss')
const typescript = require('rollup-plugin-typescript2')
const pkg = require('./package.json')

const externalPackages = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      banner: `'use client';`
    },
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named',
      banner: `'use client';`
    }
  ],
  external: externalPackages,
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      clean: true,
      tsconfig: 'tsconfig.build.json',
      exclude: ['rollup.config.ts']
    }),
    postcss({
      extensions: ['.scss', '.sass', '.css'],
      modules: true
    }),
    terser({
      compress: { directives: false }
    })
  ]
}
