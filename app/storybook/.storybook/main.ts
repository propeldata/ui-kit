import type { StorybookConfig } from '@storybook/react-webpack5'
import { join, dirname } from 'path'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: ['../documentation/**/*.mdx', '../../../packages/ui-kit/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
    {
      name: getAbsolutePath('@storybook/addon-styling-webpack'),
      options: {
        rules: [
          {
            test: /\.(sa|sc|c)ss$/,
            sideEffects: true,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1
                }
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  implementation: require.resolve('postcss')
                }
              },
              { loader: 'sass-loader' }
            ]
          }
        ]
      }
    }
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {}
  },
  docs: {
    autodocs: 'tag',
    defaultName: 'Overview'
  },
  features: {
    storyStoreV7: true,
    buildStoriesJson: true
  },
  staticDirs: ['../public/assets'],
  webpackFinal: async (config) => {
    config.module?.rules?.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      exclude: /node_modules/,
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
      }
    })

    if (config.resolve) {
      config.resolve.extensions?.push('.ts', '.tsx', '.mdx')
      config.resolve.plugins = [
        ...(config.resolve.plugins || []),
        new TsconfigPathsPlugin({
          extensions: config.resolve.extensions,
          configFile: './tsconfig.json'
        })
      ]
    }

    return config
  }
}

export default config
