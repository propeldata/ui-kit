/**
 * Retrieves the computed pixel font size as a number from a CSS font-size value.
 * This function dynamically creates an element, applies the provided font size,
 * attaches it to the DOM to calculate the computed style, and then removes it.
 * It is useful for converting relative font sizes (e.g., 'rem', 'em') to their
 * pixel equivalent for calculations that require a numeric value.
 *
 * @param {React.CSSProperties['fontSize']} value - The font size in CSS units to be converted.
 * @returns {number} The computed font size in pixels as a numeric value.
 */
export const getPixelFontSizeAsNumber = (value: React.CSSProperties['fontSize']) => {
  const element = document.createElement('div')
  element.style.fontSize = `${value}`
  element.style.position = 'absolute'
  element.style.visibility = 'hidden'
  element.textContent = 'M' // arbitrary choice of "M"

  document.body.appendChild(element)
  const computedFontSize = window.getComputedStyle(element).fontSize
  document.body.removeChild(element)

  return parseFloat(computedFontSize)
}
