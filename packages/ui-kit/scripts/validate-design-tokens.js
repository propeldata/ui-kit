const fs = require('fs')
const path = require('path')

// Function to list all css and scss files
function getAllFiles(dirPath, type = 'current', arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file)
    if (fs.statSync(fullPath).isDirectory()) {
      if (type === 'current' && file !== 'themes') {
        arrayOfFiles = getAllFiles(fullPath, type, arrayOfFiles)
      }
    } else if (file.endsWith('.css') || (type === 'new' && file.endsWith('.scss'))) {
      arrayOfFiles.push(fullPath)
    }
  })

  return arrayOfFiles
}

// Function to extract CSS variables
function extractCSSVariables(file) {
  const fileContent = fs.readFileSync(file, 'utf8')
  const regex = /--propel-[\w-]+/g // Regex updated to match only variables starting with --propel-
  return fileContent.match(regex) || []
}

function getCSSVariables(dirPath, type) {
  const files = getAllFiles(dirPath, type)
  const allVariables = []

  files.forEach((file) => {
    const variables = extractCSSVariables(file)
    variables.forEach((variable) => {
      if (!allVariables.includes(variable)) {
        allVariables.push(variable)
      }
    })
  })

  return allVariables
}

const currentVariablesList = getCSSVariables('./src', 'current')
const newVariablesList = getCSSVariables('./src/themes', 'new')

const failedVariables = []

currentVariablesList.forEach((variable) => {
  if (!newVariablesList.includes(variable)) {
    failedVariables.push(`⛔️ Variable '${variable}' is not defined in Design Tokens list`)
    // console.log(`⛔️ Variable '${variable}' is not defined in Design Tokens list`)
  }
})

if (failedVariables.length > 0) {
  console.error(failedVariables.join('\n'))
  throw new Error('🎨 Desgin Tokens: validation failed')
}

console.log('🎨 Desgin Tokens: validated ok')
