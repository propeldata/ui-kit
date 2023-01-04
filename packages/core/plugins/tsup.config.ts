import { defineConfig } from 'tsup'

export default defineConfig(() => ({
  clean: true,
  entry: ['src'],
  format: ['esm', 'cjs'],
  tsconfig: './tsconfig.build.json'
}))
