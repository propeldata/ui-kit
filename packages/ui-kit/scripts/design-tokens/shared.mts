import { exec } from 'child_process'
import fs from 'fs'
import { Ora } from 'ora'
import path from 'path'
import slugify from 'slugify'
import { promisify } from 'util'

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

const execAsync = promisify(exec)

interface GetAllFilesProps {
  dirPath: string
  type: 'current' | 'new'
  arrayOfFiles?: string[]
}

// Recursive function to get all files in a given directory
export const getAllFiles = ({ dirPath, type, arrayOfFiles = [] }: GetAllFilesProps): string[] => {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file)
    if (fs.statSync(fullPath).isDirectory()) {
      const options: GetAllFilesProps = { dirPath: fullPath, type, arrayOfFiles }
      if (type === 'current' && file !== 'themes') {
        arrayOfFiles = getAllFiles(options)
      } else if (type === 'new' && file === 'generated') {
        arrayOfFiles = getAllFiles(options)
      }
    } else if (file.endsWith('.css') || (type === 'new' && file.endsWith('.scss'))) {
      arrayOfFiles.push(fullPath)
    }
  })

  return arrayOfFiles
}

// Extract CSS variables with --propel- prefix from a given file
export const extractCSSVariables = (file: string): string[] => {
  const fileContent = fs.readFileSync(file, 'utf8')
  const regex = /--propel-[\w-]+/g // Regex updated to match only variables starting with --propel-
  return fileContent.match(regex) || []
}

// Get a list of propel's CSS variables from all CSS files in the given directory
export const getCSSVariables = (dirPath: string, type: 'current' | 'new'): string[] => {
  const files = getAllFiles({ dirPath, type })
  const allVariables = new Set<string>()

  files.forEach((file) => {
    const variables = extractCSSVariables(file)
    variables.forEach((variable) => {
      allVariables.add(variable)
    })
  })

  return Array.from(allVariables)
}

// Build SASS files into CSS
export const buildSASSFiles = async (spinner: Ora): Promise<void> => {
  try {
    const { stderr } = await execAsync('sass src:src/generated')
    if (stderr) throw new Error(stderr)
    spinner.succeed('Build SASS files')
  } catch (error) {
    spinner.fail(`Building SASS files: ${error}`)
    throw error
  }
}
