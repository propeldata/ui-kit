'use strict'

const { TextEncoder, TextDecoder } = require('util')
const OriginalJSDOMEnvironment = require('jest-environment-jsdom')

Object.defineProperty(exports, '__esModule', {
  value: true
})

class JSDOMEnvironment extends OriginalJSDOMEnvironment {
  constructor (...args) {
    const { global } = super(...args)
    if (!global.TextEncoder) global.TextEncoder = TextEncoder
    if (!global.TextDecoder) global.TextDecoder = TextDecoder
  }
}

exports.default = JSDOMEnvironment
