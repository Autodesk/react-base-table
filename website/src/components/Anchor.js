import React from 'react'
import styled from 'styled-components'
import slugify from 'slugify'

const Container = styled.div`
  margin: 20px 0 10px 0;
  font-size: 18px;
  font-weight: 500;
`

const Span = styled.span`
  display: block;
  height: 70px;
  margin-top: -70px;
  visibility: hidden;
`

const Link = styled.a`
  float: left;
  padding-right: 4px;
  margin-left: -20px;
  padding-left: 6px;

  &::before {
    content: '#';
    font-size: 16px;
    visibility: hidden;
  }

  &:hover {
    &::before {
      visibility: visible;
    }
  }
`

const Anchor = ({ title, link }) => {
  const slug = link || slugify(title, { lower: true })
  return (
    <Container id={slug}>
      <Span />
      <Link href={`#${slug}`} aria-hidden="true" />
      {title}
    </Container>
  )
}

export default Anchor
