export const getStringAttributes = (args: any) =>
  args
    ? Object.keys(args)
        .reduce((acc, item) => {
          if (typeof args[item] === 'boolean') {
            if (args[item]) {
              return acc + `${item} `
            }

            return acc
          }

          if (typeof args[item] === 'function') {
            return (
              acc + `${item}={${String(args[item]).replaceAll('_deps_exports__WEBPACK_IMPORTED_MODULE_7__.', '')}} `
            )
          }

          const val = JSON.stringify(args[item])

          return acc + `${item}=${val && ['{', '['].includes(val.charAt(0)) ? `{${val}}` : val} `
        }, '')
        .trim()
    : ''
