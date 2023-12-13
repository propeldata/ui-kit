/**
 * Converts a HEX color code to an RGBA color code.
 * The function accepts both short (3-digit) and full (6-digit) HEX codes.
 * It also handles the conversion of opacity from a scale of 0 to 1 or 0 to 100 to an RGBA opacity value.
 *
 * @param {string} hexCode - The HEX color code to be converted.
 * @param {number} opacity - The opacity value on a scale from 0 to 1 (default is 1). Values from 0 to 100 are also accepted for backward compatibility.
 * @returns {string} The resulting RGBA color code as a string.
 */
export const convertHexToRGBA = (hexCode?: string, opacity = 1) => {
  if (!hexCode) {
    throw new Error('A HEX color code is required.')
  }

  let hex = hexCode.replace('#', '')

  const isValidHex = /^([0-9A-F]{3}){1,2}$/i.test(hex)
  if (!isValidHex) {
    throw new Error('Invalid HEX color code.')
  }

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  /* Backward compatibility for whole number based opacity values. */
  if (opacity > 1 && opacity <= 100) {
    opacity = opacity / 100
  }

  return `rgba(${r},${g},${b},${opacity})`
}
