import fs, { promises as fsPromises } from 'fs'
import path from 'path'
import slugify from 'slugify'
import ora from 'ora'

const GENERATED_WARNING =
  'This file is generated automatically by scripts/parse-design-tokens.js. Do not edit manually.'

// Parse typography
const valueKeyPropMapping: Record<string, string> = {
  fontSize: 'font-size',
  fontFamily: 'font-family',
  fontWeight: 'font-weight',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing'
}

// Map font weight from string to number
const weightMapping: Record<string, string> = {
  Thin: '100',
  'Extra Light': '200',
  Light: '300',
  Regular: '400',
  Medium: '500',
  'Semi Bold': '600',
  Bold: '700',
  'Extra Bold': '800',
  Black: '900'
}

type VariableProps = {
  name: string
  type: string
  isAlias: boolean
  value: any
}

type TokenDataProps = {
  cssName: string
  jsName: string
  kind?: 'typography'
  type: 'number' | 'string'
  value: string
}

type ThemeProps = {
  name: string
  variables: VariableProps[]
}

type VariablesJSONProps = {
  collections: {
    name: string
    modes: ThemeProps[]
  }[]
}

type TypographyClassProps = {
  className: string
  props: { prop: string; value: string }[]
}

// Slugify string with strict mode
export const slugifyStr = (str: string): string => slugify(str.replaceAll('/', '-'), { lower: true, strict: true })

// Convert kebab-case to camelCase
export const kebabCaseToCamelCase = (kebabStr: string): string =>
  kebabStr
    .split('-')
    .map((word, index) => (index === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join('')

// Convert camelCase to kebab-case
export const camelCaseToKebabCase = (camelStr: string): string =>
  camelStr.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

// Parse Figma variable value
export const parseValue = (variable: VariableProps): string => {
  const { type, value } = variable
  switch (type) {
    case 'color':
      return `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`
    case 'number':
      return `${value}px`
    case 'effect': {
      const { offset, radius, spread, color } = value.effects[0]
      return `${offset.x}px ${offset.y}px ${radius}px ${spread}px rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
    }
    default:
      return value.toString()
  }
}

// Parse Figma alias value
export const parseAlias = (variable: VariableProps, tokenData: TokenDataProps[]): string => {
  const { value } = variable
  const tokenKey = slugifyStr(value.name)
  const tokenValue = tokenData.find((token) => token.cssName === `--propel-${tokenKey}`)
  return tokenValue ? `var(${tokenValue.cssName})` : ''
}

// Generate design token data
export const generateTokenValue = (key: string, value: any, tokenData: TokenDataProps[]): TokenDataProps => ({
  cssName: `--propel-${key}`,
  jsName: kebabCaseToCamelCase(key),
  kind: value.kind,
  type: value.type === 'number' ? 'number' : 'string',
  value: value.isAlias ? parseAlias(value, tokenData) : parseValue(value)
})

// Generate typography token data
export const generateTypographyValue = (key: string, type: 'number' | 'string', value: string): TokenDataProps =>
  generateTokenValue(key, { type, value, kind: 'typography' }, [])

// Write design token content to file
export const writeToFileSync = (fileName: string, content: string): void => {
  const fullPath = path.join('./src/themes/generated/', fileName)
  const dirName = path.dirname(fullPath)

  // Check if the directory exists. If not, create it
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true })
  }

  fs.writeFileSync(fullPath, content)
}

// Read Figma variables from JSON file
export const getJSONFromFile = async (): Promise<VariablesJSONProps> => {
  const data = await fsPromises.readFile('./src/themes/variables.json', 'utf-8')
  const variablesJSON: VariablesJSONProps = JSON.parse(data)

  return variablesJSON
}

// Get theme tokens

export const getThemeTokens = ({
  name,
  themes,
  variables,
  tokens
}: {
  name: string
  themes?: ThemeProps[]
  variables: TokenDataProps[]
  tokens: TokenDataProps[]
}) =>
  themes
    ?.find((theme) => theme.name.toLowerCase() === name)
    ?.variables.map((variable) =>
      generateTokenValue(
        slugifyStr(variable.name.split('/').pop() ?? ''),
        variable,
        variable.isAlias ? variables : tokens
      )
    )

const main = async () => {
  const spinner = ora({ text: 'Parsing design variables and tokens...', color: 'yellow' }).start()

  try {
    const variablesJSON = await getJSONFromFile()

    if (!variablesJSON) {
      spinner.fail('Failed to parse variables.json')
      throw new Error('Failed to parse variables.json')
    }

    const variables: TokenDataProps[] = []
    const tokens: TokenDataProps[] = []

    // Parse variables
    variablesJSON.collections
      .filter(({ name }) => ['_Primitives'].includes(name))
      .forEach((collection) => {
        collection.modes[0].variables.forEach((variable) => {
          variables.push(generateTokenValue(slugifyStr(variable.name), variable, variables))
        })
      })

    // Parse tokens
    variablesJSON.collections
      .filter(({ name }) => ['2. Radius', '3. Spacing', '4. Widths', 'Effects'].includes(name))
      .forEach((collection) => {
        collection.modes[0].variables.forEach((variable) => {
          tokens.push(generateTokenValue(slugifyStr(variable.name), variable, variables))
        })
      })

    const typographyClasses: TypographyClassProps[] = []

    variablesJSON.collections
      ?.find(({ name }) => name === 'Typography')
      ?.modes?.find(({ name }) => name.toLowerCase() === 'style')
      ?.variables?.forEach((variable) => {
        const key = slugifyStr(variable.name)
        const typographyClass: TypographyClassProps = {
          className: kebabCaseToCamelCase(key),
          props: []
        }

        for (const valueKey in variable.value) {
          const propKey = slugifyStr(`${key}-${camelCaseToKebabCase(valueKey)}`)
          let typographyValue: TokenDataProps | undefined

          if (['fontSize', 'fontFamily', 'fontWeight', 'lineHeight', 'letterSpacing'].includes(valueKey)) {
            let value = variable.value[valueKey]

            // Wrap font family with quotes
            if (valueKey === 'fontFamily') {
              value = `'${value}'`
            }

            // Map font weight from string value to number
            if (valueKey === 'fontWeight') {
              value = weightMapping[value] ?? value
            }

            if (valueKey === 'lineHeight' || valueKey === 'letterSpacing') {
              value = `${value}${
                variable.value[valueKey === 'lineHeight' ? 'lineHeightUnit' : 'letterSpacingUnit'] === 'PIXELS'
                  ? 'px'
                  : '%'
              }`
            }

            typographyValue = generateTypographyValue(propKey, valueKey === 'fontSize' ? 'number' : 'string', value)
          }

          if (typographyValue) {
            variables.push(typographyValue)
            typographyClass.props.push({ prop: valueKeyPropMapping[valueKey], value: `var(--propel-${propKey})` })
          }
        }

        typographyClasses.push(typographyClass)
      })

    const themes = variablesJSON.collections.find(({ name }) => name === '1. Color Modes')?.modes

    // Parse theme tokens
    const lightTheme = getThemeTokens({ name: 'light', themes, variables, tokens })
    const darkTheme = getThemeTokens({ name: 'dark', themes, variables, tokens })

    // Generate _variables.scss
    writeToFileSync(
      '_variables.scss',
      [
        `// ${GENERATED_WARNING}\n`,
        '.variables {',
        variables.map(({ cssName, value }) => `  ${cssName}: ${value};`).join('\n'),
        '}'
      ].join('\n')
    )

    // Generate _tokens.scss
    writeToFileSync(
      '_tokens.scss',
      [
        `// ${GENERATED_WARNING}\n`,
        "@use './variables';\n",
        '.tokens {',
        '  @extend .variables;\n',
        tokens.map(({ cssName, value }) => `  ${cssName}: ${value};`).join('\n'),
        '}\n',
        typographyClasses
          .map((typographyClass) =>
            [
              `.${typographyClass.className} {`,
              '  @extend .variables;\n',
              typographyClass.props.map(({ prop, value }) => `  ${prop}: ${value};`).join('\n'),
              '}\n'
            ].join('\n')
          )
          .join('\n')
      ].join('\n')
    )

    // Generate _lightTheme.scss and _darkTheme.scss
    const themesList = [
      { name: 'lightTheme', theme: lightTheme },
      { name: 'darkTheme', theme: darkTheme }
    ]
    themesList.forEach(({ name, theme }) => {
      writeToFileSync(
        `_${name}.scss`,
        [
          `// ${GENERATED_WARNING}\n`,
          "@use './tokens';\n",
          `.${name} {`,
          '  @extend .tokens;\n',
          theme?.map(({ cssName, value }) => `  ${cssName}: ${value};`).join('\n'),
          '}'
        ].join('\n')
      )
    })

    const tsItems = [...tokens, ...variables]
    if (lightTheme) {
      tsItems.push(...lightTheme)
    }

    // Generate theme.types.ts
    writeToFileSync(
      'theme.types.ts',
      [
        `// ${GENERATED_WARNING}\n`,
        'export type ThemeTokenGeneratedProps = {',
        tsItems.map(({ jsName }) => `  ${jsName}?: string;`).join('\n'),
        '}\n',
        'export type ThemeCSSTokenGeneratedProps = {',
        lightTheme?.map(({ cssName }) => `  '${cssName}'?: string;`).join('\n'),
        '}'
      ].join('\n')
    )

    // Generate themeTokens.ts
    writeToFileSync(
      'themeTokens.ts',
      [
        `// ${GENERATED_WARNING}\n`,
        "import type { ThemeTokenGeneratedProps } from './theme.types'\n",
        'export const themeTokensGenerated: (keyof ThemeTokenGeneratedProps)[] = [',
        tsItems.map(({ jsName }) => `  '${jsName}',`).join('\n'),
        ']'
      ].join('\n')
    )

    // Generate themeDict.ts
    writeToFileSync(
      'themeDict.ts',
      [
        `// ${GENERATED_WARNING}\n`,
        'export const themeDict = [',
        tsItems.map(({ jsName, cssName }) => `  { name: '${jsName}', cssVarName: '${cssName}' },`).join('\n'),
        ']'
      ].join('\n')
    )

    spinner.succeed('Parse design variables and tokens')
  } catch (err) {
    console.error(err)
    spinner.fail('Failed to parse design variables and tokens')
  }
}

main()
