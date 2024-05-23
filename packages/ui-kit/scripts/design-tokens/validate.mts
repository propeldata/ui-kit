import ora, { Ora } from 'ora'
import { getCSSVariables, buildSASSFiles } from './shared.mjs'

const FAILED_MESSAGE = 'Design tokens validation failed'

// Compare current and new CSS variables, and log any missing variables
export const validateDesignTokens = (spinner: Ora): void => {
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
