import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  clean: true,
  entry: ['src'],
  format: ['esm', 'cjs'],
  outExtension(ctx) {
    return { js: `.${ctx.format}.js` }
  },
  tsconfig: './tsconfig.build.json'
}))
