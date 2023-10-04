export const quotedStringRegex = (input: string) => new RegExp(`[\`"']${input}[\`"']`, 'g')
