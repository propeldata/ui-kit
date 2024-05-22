const fs = require('node:fs')

const generatedFilePath = process.argv[2]
const generatedFileContent = fs.readFileSync(generatedFilePath).toString()

fs.writeFileSync(
  generatedFilePath,
  generatedFileContent
    .replaceAll(/import { requestinit } from.+\r?\n/gi, '')
    // https://github.com/dotansimha/graphql-code-generator-community/issues/509
    .replaceAll(/ variables]/gi, ' dataSource, variables]')
)
