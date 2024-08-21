const commonjs = require('@rollup/plugin-commonjs')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const postcss = require('rollup-plugin-postcss')
const typescript = require('rollup-plugin-typescript2')
const preserveDirectives = require('rollup-plugin-preserve-directives').preserveDirectives
// const pkg = require('./package.json')

// const externalPackages = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {}), 'react-is', 'prop-types', 'react/jsx-runtime', 'react-day-picker/dist/style.module.css']

// console.log(externalPackages)

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    {
      dir: 'dist/esm',
      format: 'esm',
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: 'src'
    }
  ],
  external: (id) => {
    if (
      id.startsWith('src') ||
      id.startsWith('../') ||
      id.startsWith('./') ||
      id.endsWith('.ts') ||
      id.endsWith('.tsx') ||
      id.endsWith('.scss')
    ) {
      return false
    }
    return true
  },
  onwarn: (warning, warn) => {
    if (
      warning.message.includes('Module level directives cause errors when bundled, "use client" in') ||
      warning.code === 'MODULE_LEVEL_DIRECTIVE'
    ) {
      return
    }
    warn(warning)
  },
  plugins: [
    nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      preferBuiltins: true,
      modulesOnly: true
    }),
    commonjs({
      include: /node_modules/,
      requireReturnsDefault: 'auto'
    }),
    typescript({
      clean: true,
      tsconfig: 'tsconfig.build.json',
      exclude: ['rollup.config.ts']
    }),
    postcss({
      extensions: ['.scss', '.sass', '.css'],
      modules: true
    }),
    preserveDirectives()
  ]
}
