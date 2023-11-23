const fs = require('node:fs')

const generatedFilePath = process.argv[2]
const generatedFileContent = fs.readFileSync(generatedFilePath).toString()

fs.writeFileSync(
  generatedFilePath,
  generatedFileContent
    .replaceAll(/import { requestinit } from.+\r?\n/gi, '')
    .replaceAll(/ variables]/gi, ' dataSource, variables]')
)
