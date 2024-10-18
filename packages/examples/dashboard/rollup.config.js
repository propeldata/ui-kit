const commonjs = require('@rollup/plugin-commonjs')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const terser = require('@rollup/plugin-terser')
const postcss = require('rollup-plugin-postcss')
const typescript = require('rollup-plugin-typescript2')
const tailwindcss = require('tailwindcss')
const svgr = require('@svgr/rollup')
const pkg = require('./package.json')

const tailwindConfig = require('./tailwind.config.js')
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
    postcss({
      extensions: ['.scss', '.sass', '.css'],
      extract: true,
      minimize: true,
      plugins: [tailwindcss(tailwindConfig), require('autoprefixer')]
    }),
    nodeResolve(),
    commonjs(),
    svgr(),
    typescript({
      clean: true,
      tsconfig: 'tsconfig.build.json',
      exclude: ['rollup.config.ts']
    }),
    terser({
      compress: { directives: false }
    })
  ]
}
