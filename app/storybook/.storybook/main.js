module.exports = {
  stories: ['../../../packages/ui-kit/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: '@storybook/react',
  reactDocgen: false,
  staticDirs: ['../public'],
  core: {
    builder: '@storybook/builder-webpack5'
  },
  webpackFinal: (config) => {
    config.performance = {
      hints: false
    }
    return config
  },
  babel: async (options) => ({
    ...options,
    presets: [
      ...options.presets,
      [
        '@babel/preset-react',
        {
          runtime: 'automatic'
        },
        'preset-react-jsx-transform'
      ]
    ]
  })
}
