import { create } from '@storybook/theming/create'
import packageInfo from '../../../packages/ui-kit/package.json'

export const defaultTheme = create({
  base: 'light',
  brandTitle: `UI Kit v.${packageInfo.version}`,
  brandImage: '/propel-logo.svg'
  //   fontBase: '"Inter", sans-serif'
})
