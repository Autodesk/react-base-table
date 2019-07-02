import React from 'react'
import rehypeReact from 'rehype-react'

import CodeBlock from './CodeBlock'
import CodePreview from './CodePreview'

const Pre = props => {
  if (!props.children[0]) return <pre {...props} />

  const { children, className } = props.children[0].props
  const language = className && className.split('-')[1]
  const code = children[0]

  let meta
  try {
    const dataMeta = props.children[0].props['data-meta']
    // eslint-disable-next-line
    meta = dataMeta && eval(`(${dataMeta})`)
    if (typeof meta !== 'object') meta = {}
  } catch (err) {}

  const { live, ...rest } = meta || {}
  const Component = live ? CodePreview : CodeBlock
  return <Component code={code} language={language} {...rest} />
}

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: {
    pre: Pre,
  },
}).Compiler

const Document = ({ htmlAst, ...rest }) => (
  <div {...rest}>{renderAst(htmlAst)}</div>
)

export default Document
