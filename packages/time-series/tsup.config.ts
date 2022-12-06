import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['src'],
  format: ['esm', 'cjs'],
  target: 'ES6',
  tsconfig: './tsconfig.build.json',
  dts: true,
  clean: true,
  minify: !options.watch
}))
