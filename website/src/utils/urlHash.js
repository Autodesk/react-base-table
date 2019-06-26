import LZString from 'lz-string'

// eslint-disable-next-line
const sampleCode = require('!raw-loader!./sample.code')

export const getCode = () => {
  if (typeof document === 'undefined') return sampleCode

  const hash = document.location.hash.slice(1)
  if (!hash) return sampleCode

  return (
    LZString.decompressFromEncodedURIComponent(hash) || decodeURIComponent(hash)
  )
}

export const replaceState = code => {
  const hash = code ? LZString.compressToEncodedURIComponent(code) : ''

  if (
    typeof URL === 'function' &&
    typeof window.history === 'object' &&
    typeof window.history.replaceState === 'function'
  ) {
    const url = new URL(document.location)
    url.hash = hash
    window.history.replaceState(null, null, url)
  } else {
    document.location.hash = hash
  }
}
