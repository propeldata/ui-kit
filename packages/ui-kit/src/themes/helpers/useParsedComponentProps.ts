import { useCallback, useContext } from 'react'
import { ThemeContext } from '../../components/ThemeProvider'
import { AccentColors, GrayColors, ThemeSettingProps } from '../theme.types'
import { getMatchingGrayColor } from './getMatchingGrayColor'

export const useParsedComponentProps = ({
  appearance,
  accentColor: accentColorProp,
  grayColor: grayColorProp,
  radius,
  scaling,
  panelBackground,
  ...rest
}: Partial<ThemeSettingProps>) => {
  const context = useContext(ThemeContext)

  const getDefault = useCallback(
    (defaultValue: string) => {
      return !context ? defaultValue : undefined
    },
    [context]
  )

  const accentColor = accentColorProp ? accentColorProp : (getDefault('blue') as AccentColors)
  const grayColorVal = grayColorProp ? grayColorProp : (getDefault('auto') as GrayColors)
  const grayColor = grayColorVal === 'auto' ? getMatchingGrayColor(accentColor ?? 'blue') : grayColorVal

  const parsedProps = {
    'data-accent-color': accentColor,
    'data-gray-color': grayColor,
    'data-radius': radius ? radius : getDefault('medium'),
    'data-scaling': scaling ? scaling : getDefault('100%'),
    'data-panel-background': panelBackground ? panelBackground : getDefault('translucent')
  }

  return {
    themeSettings: {
      appearance,
      accentColor,
      grayColor,
      radius,
      scaling,
      panelBackground
    },
    parsedProps: {
      ...parsedProps,
      ...rest
    },
    parsedPropsWithoutRest: {
      ...parsedProps
    }
  }
}
