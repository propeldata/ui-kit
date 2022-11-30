const hmr = process.argv.includes('--hmr')

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  watch: !hmr,
  nodeResolve: {
    exportConditions: ['browser', 'development']
  },
  plugins: []
})
