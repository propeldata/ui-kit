export function getIsNonNumeric(value: unknown) {
  return isNaN(Number(value)) || typeof value === 'boolean' || typeof value === 'object'
}
