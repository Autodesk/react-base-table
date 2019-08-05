import React from 'react'
import rehypeReact from 'rehype-react'

import CodeBlock from './CodeBlock'
import CodePreview from './CodePreview'

const parseMeta = meta => {
  const options = {}
  if (!meta) return options

  const items = meta.split(/\s+/)
  items.forEach(item => {
    if (/^[\w-]+=?$/.test(item)) options[item] = true
    else if (/^[\w-]+=[^=]+$/.test(item)) {
      const [key, value] = item.split('=')
      let parsed = value
      if (value === 'true') parsed = true
      else if (value === 'false') parsed = false
      else if (/^\d+$/.test(value)) parsed = parseInt(value, 10)
      else if (/^\d*\.\d+$/.test(value)) parsed = parseFloat(value)
      else if (/^['"].*['"]$/.test(value))
        parsed = value.substr(1, value.length - 2)
      else if (/^{.*}$/.test(value)) {
        try {
          // eslint-disable-next-line no-eval
          parsed = eval(`(${value})`)
        } catch (err) {}
      }
      options[key] = parsed
    }
  })
  return options
}

const Pre = props => {
  if (!props.children[0]) return <pre {...props} />

  const { children, className } = props.children[0].props
  const language = className && className.split('-')[1]
  const code = children[0]

  const meta = parseMeta(props.children[0].props['data-meta'])
  const { live, ...rest } = meta
  const Component = live ? CodePreview : CodeBlock
  return (
    <Component
      code={code}
      language={language}
      {...rest}
      style={{ marginBottom: '1.2rem' }}
    />
  )
}

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: {
    pre: Pre,
  },
}).Compiler

const Html = ({ html, htmlAst, ...rest }) => {
  if (htmlAst) {
    return <div {...rest}>{renderAst(htmlAst)}</div>
  }

  if (html) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  }

  return null
}

export default Html
