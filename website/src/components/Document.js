import React from 'react'

const Document = ({ html, className }) => (
  <div
    className={className ? `markdown-body ${className}` : 'markdown-body'}
    dangerouslySetInnerHTML={{
      __html: html,
    }}
  />
)

export default Document
