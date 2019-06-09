import React from 'react'
import ReactDOM from 'react-dom'
import styled, { css, keyframes, createGlobalStyle } from 'styled-components'
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
} from 'react-live-runner'

import BaseTable, {
  Column,
  SortOrder,
  AutoResizer,
  normalizeColumns,
  unflatten,
} from 'react-base-table'
import 'react-base-table/styles.css'

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

const Table = props => <BaseTable width={720} height={400} {...props} />
Table.Column = Column

const EditorContainer = styled.div`
  flex: 0 1 500px;
  overflow: auto;
`

const StyledEditor = styled(LiveEditor)`
  white-space: pre;
  background: #222;
  caret-color: #fff;
  min-width: 100%;
  min-height: 100%;
  float: left;
  font-size: 16px;

  & > textarea,
  & > pre {
    outline: none;
    white-space: pre !important;
  }
`

const PreviewContainer = styled.div`
  flex: 1 1 500px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
`

const StyledPreview = styled(LivePreview)`
  position: relative;
  width: 100%;
  height: 100%;
`

const StyledError = styled(LiveError)`
  background: #fcc;
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  margin: 0;
  padding: 10px;
  color: #f00;
  white-space: pre;
`

const Container = styled.div`
  display: flex;
  box-shadow: 0 0 8px 0 lightsteelblue;
  height: 100%;

  ${props =>
    props.vertical &&
    css`
      flex-direction: column-reverse;

      ${EditorContainer} {
        flex: none;
        height: 300px;
      }

      ${PreviewContainer} {
        flex: none;
        min-height: 400px;
      }
    `}
`

const LiveRunner = ({ children, code, scope = {}, vertical, ...rest }) => (
  <Container vertical={vertical} {...rest}>
    <LiveProvider
      code={code}
      scope={{
        React,
        ReactDOM,
        styled,
        css,
        keyframes,
        createGlobalStyle,
        Table,
        BaseTable,
        Column,
        SortOrder,
        AutoResizer,
        normalizeColumns,
        unflatten,
        generateColumns,
        generateData,
        noop,
        delay,
        action,
        ...scope,
      }}
    >
      <EditorContainer>
        <StyledEditor />
      </EditorContainer>
      {children}
      <PreviewContainer>
        <StyledPreview />
        <StyledError />
      </PreviewContainer>
    </LiveProvider>
  </Container>
)

export default LiveRunner
