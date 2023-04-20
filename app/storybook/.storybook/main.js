module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
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
  }
}
