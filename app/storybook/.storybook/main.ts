import { dirname, join } from 'path'
import { mergeConfig } from 'vite'
import type { StorybookConfig } from '@storybook/react-vite'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: ['../../../packages/ui-kit/**/*.mdx', '../../../packages/ui-kit/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-styling'),
    getAbsolutePath('@storybook/addon-a11y')
  ],
  framework: {
    // This is workaround for Storybook 7 in monorepo
    // @ts-ignore
    name: getAbsolutePath('@storybook/react-vite'),
    options: {}
  },
  core: {
    builder: '@storybook/builder-vite'
  },
  docs: {
    autodocs: true,
    defaultName: 'Overview'
  },
  features: {
    storyStoreV7: true,
    buildStoriesJson: true
    // emotionAlias: false,
  },
  typescript: {
    // Overrides the default Typescript configuration to allow multi-package components to be documented via Autodocs.
    // See: https://storybook.js.org/docs/angular/writing-docs/autodocs?ref=storybookblog.ghost.io#the-auto-generated-documentation-is-not-showing-up-in-a-monorepo-setup
    reactDocgen: 'react-docgen',
    skipBabel: true,
    check: false
  },
  staticDirs: ['../../../packages/ui-kit/docs/assets', '../public/assets'],
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        optimizeDeps: {
          include: ['@emotion/react/jsx-dev-runtime']
        },
        alias: {
          '@storybook/blocks': getAbsolutePath('@storybook/blocks')
        }
      }
    })
  }
}

export default config
