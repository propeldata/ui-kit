import * as radixColors from '@radix-ui/colors'

/**
 * Returns a color based on an arbitrary string color passed
 * this string color could be a radix color, a hex, or rgb
 */
export function handleArbitraryColor(color: string) {
  let result: string = color

  if (color == null) {
    return result
  }

  const colorRoute = color.split('.')
  if (colorRoute.length === 2) {
    const colorFamily = colorRoute[0] as keyof typeof radixColors
    const colorShade = colorRoute[1]
    if (colorFamily in radixColors && colorShade in radixColors[colorFamily as keyof typeof radixColors]) {
      result =
        radixColors[colorFamily as keyof typeof radixColors][
          colorShade as keyof (typeof radixColors)[keyof typeof radixColors]
        ]
    }
  }

  return result
}
