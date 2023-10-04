export const getStringAttributes = (args: any) =>
  Object.keys(args)
    .reduce((acc, item) => {
      if (typeof args[item] === 'boolean') {
        if (args[item]) {
          return acc + `${item} `
        }

        return acc
      }

      const val = JSON.stringify(args[item])

      return acc + `${item}=${['{', '['].includes(val.charAt(0)) ? `{${val}}` : val} `
    }, '')
    .trim()
