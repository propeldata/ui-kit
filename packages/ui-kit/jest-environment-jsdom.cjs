'use strict'

const { TextEncoder, TextDecoder } = require('util')
const OriginalJSDOMEnvironment = require('jest-environment-jsdom')

Object.defineProperty(exports, '__esModule', {
  value: true
})

class JSDOMEnvironment extends OriginalJSDOMEnvironment {
  constructor(...args) {
    const { global } = super(...args)
    if (!global.TextEncoder) global.TextEncoder = TextEncoder
    if (!global.TextDecoder) global.TextDecoder = TextDecoder
    if (!global.fetch) global.fetch = fetch
    if (!global.Request) global.Request = Request
    if (!global.Response) global.Response = Response
    if (!global.Headers) global.Headers = Headers
  }
}

exports.default = JSDOMEnvironment
