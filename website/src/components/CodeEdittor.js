import React from 'react'
import ReactDOM from 'react-dom'
import styled, { css, keyframes, createGlobalStyle } from 'styled-components'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'

import Table, {
  Column,
  SortOrder,
  AutoResizer,
  normalizeColumns,
  unflatten,
} from 'react-base-table'

import '../utils/prismTemplateString'

const Container = styled.div`
  width: 100%;
  height: 100%;
`

const generateColumns = (count = 10, prefix = 'column-', props) =>
  new Array(count).fill(0).map((column, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }))

const generateData = (columns, count = 200, prefix = 'row-') =>
  new Array(count).fill(0).map((row, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })

const noop = () => {}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const action = message => args => console.log(message, args)

const StyledProvider = styled(LiveProvider)`
  box-shadow: 1px 1px 20px rgba(20, 20, 20, 0.27);
  overflow: hidden;
  text-align: left;
  height: 100%;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: stretch;
  height: 100%;
`

const StyledEditor = styled(LiveEditor)`
  background: #1d1f27;
  font-size: 13px;
  font-weight: 300;
  overflow-y: scroll;
  overflow-x: auto;
  cursor: text;
  white-space: pre-wrap;
  margin: 0;
  border: 0;
  padding: 10px !important;
  outline: none;
  color: #c5c8c6;
  flex: 0 1 500px;
  height: 100%;
`

const PreviewContainer = styled.div`
  flex: 1 1 500px;
  position: relative;
  background: #fff;
`

const StyledPreview = styled(LivePreview)`
  position: relative;
  padding: 10px;
  height: 100%;
  overflow: auto;
`

const StyledError = styled(LiveError)`
  padding: 10px;
  background: #f55;
  color: #fff;
  white-space: pre;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: auto;
`

const CodeEditor = ({ noInline, code, scope = {} }) => (
  <StyledProvider
    code={code}
    noInline={noInline}
    scope={{
      React,
      ReactDOM,
      styled,
      css,
      keyframes,
      createGlobalStyle,
      Table,
      Column,
      SortOrder,
      AutoResizer,
      normalizeColumns,
      unflatten,
      Container,
      generateColumns,
      generateData,
      noop,
      delay,
      action,
      ...scope,
    }}
  >
    <Row>
      <StyledEditor />
      <PreviewContainer>
        <StyledPreview />
        <StyledError />
      </PreviewContainer>
    </Row>
  </StyledProvider>
)

export default CodeEditor
