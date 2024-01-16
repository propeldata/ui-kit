const fs = require('fs')
const path = require('path')

function kebabCaseToCamelCase(kebabStr) {
  return kebabStr
    .split('-')
    .map((word, index) => (index === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join('')
}

function writeToFile(fileName, content) {
  try {
    fs.writeFileSync(`./src/themes/generated/${fileName}`, content)
  } catch (err) {
    console.error(err)
  }
}

const data = fs.readFileSync('./src/themes/variables.json')
const variablesJSON = JSON.parse(data)

if (!variablesJSON) {
  console.error('Error parsing JSON')
  return
}

const primitives = variablesJSON.collections.find(({ name }) => name === 'Primitives').modes[0].variables
const tokens = variablesJSON.collections.find(({ name }) => name === 'Tokens').modes[0].variables

const variables = tokens.map((token) => {
  const keys = token.name.split('/')
  const key = keys.at(keys.length - 1).toLowerCase()
  const primitiveValue = primitives.find((item) => item.name === token.value.name)
  let value = primitiveValue.value
  if (primitiveValue.type === 'number') {
    value = `${primitiveValue.value}px`
  }

  return {
    cssName: `--propel-${key}`,
    jsName: kebabCaseToCamelCase(key),
    type: primitiveValue.type === 'number' ? 'number' : 'string',
    value
  }
})

// Define the directory path you want to create
const dirPath = path.join(__dirname, '../src/themes/generated')
// Check if the directory exists
if (!fs.existsSync(dirPath)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dirPath, { recursive: true })
}

// Generate _tokens.scss
writeToFile(
  '_tokens.scss',
  `// This file is generated automatically by scripts/parse-design-tokens.js. Do not edit manually.\n
.tokens {
${variables.map(({ cssName, value }) => `  ${cssName}: ${value};`).join('\n')}
}\n`
)

// Generate theme.types.ts
writeToFile(
  'theme.types.ts',
  `// This file is generated automatically by scripts/parse-design-tokens.js. Do not edit manually.\n
export type ThemeTokenGeneratedProps = {
${variables.map(({ jsName, type }) => `  ${jsName}?: ${type};`).join('\n')}
}

export type ThemeCSSTokenGeneratedProps = {
${variables.map(({ cssName, type }) => `  '${cssName}'?: ${type};`).join('\n')}
}\n`
)

// Generate themeTokens.ts
writeToFile(
  'themeTokens.ts',
  `// This file is generated automatically by scripts/parse-design-tokens.js. Do not edit manually.\n
import type { ThemeTokenGeneratedProps } from './theme.types'

export const themeTokensGenerated: (keyof ThemeTokenGeneratedProps)[] = [
${variables.map(({ jsName }) => `  '${jsName}',`).join('\n')}
]\n`
)

console.log('🎨 Desgin Tokens: parsed ok')
