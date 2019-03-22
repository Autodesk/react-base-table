import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-jsx'

export default (code, language) => {
  const lang = languages[language]
  if (!lang) return code
  return highlight(code, lang)
}
