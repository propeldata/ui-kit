import fs from 'fs'
import path from 'path'
import ora, { Ora } from 'ora'
import { exec } from 'child_process'
import { promisify } from 'util'

const FAILED_MESSAGE = 'Design tokens validation failed'

const execAsync = promisify(exec)

interface GetAllFilesProps {
  dirPath: string
  type: 'current' | 'new'
  arrayOfFiles?: string[]
}

// Recursive function to get all files in a given directory
const getAllFiles = ({ dirPath, type, arrayOfFiles = [] }: GetAllFilesProps): string[] => {
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
const extractCSSVariables = (file: string): string[] => {
  const fileContent = fs.readFileSync(file, 'utf8')
  const regex = /--propel-[\w-]+/g // Regex updated to match only variables starting with --propel-
  return fileContent.match(regex) || []
}

// Get a list of propel's CSS variables from all CSS files in the given directory
const getCSSVariables = (dirPath: string, type: 'current' | 'new'): string[] => {
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
const buildSASSFiles = async (spinner: Ora): Promise<void> => {
  try {
    const { stderr } = await execAsync('sass src:src/generated')
    if (stderr) throw new Error(stderr)
    spinner.succeed('Build SASS files')
  } catch (error) {
    spinner.fail(`Building SASS files: ${error}`)
    throw error
  }
}

// Compare current and new CSS variables, and log any missing variables
const validateDesignTokens = (spinner: Ora): void => {
  spinner.start('Validating design tokens...')
  let validationFailed = false

  const currentVariablesList = getCSSVariables('./src', 'current')
  const newVariablesList = getCSSVariables('./src/themes', 'new')

  currentVariablesList.forEach((variable) => {
    if (!newVariablesList.includes(variable)) {
      spinner.warn(`Design token '${variable}' is not defined`)
      validationFailed = true
    }
  })

  if (validationFailed) {
    throw new Error(FAILED_MESSAGE)
  }

  spinner.succeed('Validate design tokens')
}

async function main() {
  const spinner = ora({ text: 'Building SASS files...', color: 'yellow' }).start()

  try {
    await buildSASSFiles(spinner)
    validateDesignTokens(spinner)
  } catch (error) {
    spinner.fail(FAILED_MESSAGE)
    console.error(error)
  }
}

main()
