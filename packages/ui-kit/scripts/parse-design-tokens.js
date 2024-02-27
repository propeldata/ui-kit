const fs = require('fs')
const path = require('path')
const slugify = require('slugify')

const GENERATED_WARNING =
  'This file is generated automatically by scripts/parse-design-tokens.js. Do not edit manually.'

function slugifyStr(str) {
  return slugify(str.replaceAll('/', '-'), { lower: true, strict: true })
}

function parseValue(variable, tokens) {
  const { type, isAlias, value } = variable

  if (isAlias) {
    const tokenKey = slugifyStr(variable.value.name)
    const token = tokens.find((token) => token.cssName === `--propel-${tokenKey}`)
    return `var(${token.cssName})`
  }

  if (type === 'typography') {
    console.log({ value })
  }

  if (type === 'color') {
    return `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`
  }

  if (type === 'number') {
    return `${value}px`
  }

  if (type === 'effect') {
    const { offset, radius, spread, color } = value.effects[0]
    return `${offset.x}px ${offset.y}px ${radius}px ${spread}px rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
  }

  return value
}

function kebabCaseToCamelCase(kebabStr) {
  return kebabStr
    .split('-')
    .map((word, index) => (index === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join('')
}

function camelCaseToKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Insert dash between lower and upper case letters
    .replace(/^-/, '') // Remove leading dash if present
    .toLowerCase() // Convert to lower case
}

function getToken(key, variable, tokens) {
  return {
    cssName: `--propel-${key}`,
    jsName: kebabCaseToCamelCase(key),
    type: variable.type === 'number' ? 'number' : 'string',
    value: parseValue(variable, tokens)
  }
}

function getTypographyToken(key, type, value) {
  return {
    cssName: `--propel-${key}`,
    jsName: kebabCaseToCamelCase(key),
    type: type === 'number' ? 'number' : 'string',
    value
  }
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

const tokens = []

// Parse primitives
variablesJSON.collections
  .filter(({ name }) => ['_Primitives', '2. Radius', '3. Spacing', '3. Widths', 'Effects'].includes(name))
  .forEach((collection) => {
    collection.modes[0].variables.forEach((variable) => {
      tokens.push(getToken(slugifyStr(variable.name), variable, tokens))
    })
  })

const typographyClasses = []

// Parse typography
variablesJSON.collections
  .find(({ name }) => name === 'Typography')
  .modes.find(({ name }) => name.toLowerCase() === 'style')
  .variables.forEach((variable) => {
    const key = slugifyStr(variable.name)
    const typographyClass = {
      className: kebabCaseToCamelCase(key),
      props: []
    }

    for (const valueKey in variable.value) {
      const propKey = slugifyStr(`${key}-${camelCaseToKebabCase(valueKey)}`)

      if (valueKey === 'fontSize') {
        tokens.push(getTypographyToken(propKey, 'number', `${variable.value[valueKey]}px`))
        typographyClass.props.push({ prop: 'font-size', value: `var(--propel-${propKey})` })
      }
      if (valueKey === 'fontFamily') {
        tokens.push(getTypographyToken(propKey, 'string', `'${variable.value[valueKey]}'`))
        typographyClass.props.push({ prop: 'font-family', value: `var(--propel-${propKey})` })
      }
      if (valueKey === 'fontWeight') {
        tokens.push(getTypographyToken(propKey, 'string', `'${variable.value[valueKey]}'`))
        typographyClass.props.push({ prop: 'font-weight', value: `var(--propel-${propKey})` })
      }
      if (valueKey === 'lineHeight') {
        tokens.push(
          getTypographyToken(
            propKey,
            'string',
            `${variable.value[valueKey]}${variable.value['lineHeightUnit'] === 'PIXELS' ? 'px' : '%'}`
          )
        )
        typographyClass.props.push({ prop: 'line-height', value: `var(--propel-${propKey})` })
      }
      if (valueKey === 'letterSpacing') {
        tokens.push(
          getTypographyToken(
            propKey,
            'string',
            `${variable.value[valueKey]}${variable.value['letterSpacingUnit'] === 'PIXELS' ? 'px' : '%'}`
          )
        )
        typographyClass.props.push({ prop: 'letter-spacing', value: `var(--propel-${propKey})` })
      }
    }

    typographyClasses.push(typographyClass)
  })

const themes = variablesJSON.collections.find(({ name }) => name === '1. Color Modes').modes

// Parse light theme
const lightTheme = themes
  .find(({ name }) => name.toLowerCase() === 'light mode')
  .variables.map((variable) => getToken(slugifyStr(variable.name.split('/').pop()), variable, tokens))

// Parse dark theme
const darkTheme = themes
  .find(({ name }) => name.toLowerCase() === 'dark mode')
  .variables.map((variable) => getToken(slugifyStr(variable.name.split('/').pop()), variable, tokens))

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
  `// ${GENERATED_WARNING}\n
.tokens {
${tokens.map(({ cssName, value }) => `  ${cssName}: ${value};`).join('\n')}
}\n`
)

// Generate _lightTheme.scss
writeToFile(
  '_lightTheme.scss',
  `// ${GENERATED_WARNING}\n
@use './_tokens';

.lightTheme {
  @extend .tokens;

${lightTheme.map(({ cssName, value }) => `  ${cssName}: ${value};`).join('\n')}
}\n`
)

// Generate _darkTheme.scss
writeToFile(
  '_darkTheme.scss',
  `// ${GENERATED_WARNING}\n
@use './_tokens';

.darkTheme {
  @extend .tokens;

${darkTheme.map(({ cssName, value }) => `  ${cssName}: ${value};`).join('\n')}
}\n`
)

// Generate _typography.scss
writeToFile(
  '_typography.scss',
  `// ${GENERATED_WARNING}\n
${typographyClasses
  .map(
    (typographyClass) => `.${typographyClass.className} {
${typographyClass.props.map(({ prop, value }) => `  ${prop}: ${value};`).join('\n')}
}\n`
  )
  .join('\n')}
`
)

// Generate theme.types.ts
writeToFile(
  'theme.types.ts',
  `// ${GENERATED_WARNING}\n
export type ThemeTokenGeneratedProps = {
${tokens.map(({ jsName, type }) => `  ${jsName}?: ${type};`).join('\n')}
}

export type ThemeCSSTokenGeneratedProps = {
${lightTheme.map(({ cssName, type }) => `  '${cssName}'?: ${type};`).join('\n')}
}\n`
)

// Generate themeTokens.ts
writeToFile(
  'themeTokens.ts',
  `// ${GENERATED_WARNING}\n
import type { ThemeTokenGeneratedProps } from './theme.types'

export const themeTokensGenerated: (keyof ThemeTokenGeneratedProps)[] = [
${tokens.map(({ jsName }) => `  '${jsName}',`).join('\n')}
]\n`
)

console.log('🎨 Desgin Tokens: parsed ok')
