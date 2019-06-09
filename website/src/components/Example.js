import React, { useMemo } from 'react'
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
  TableRow as BaseTableRow,
} from 'react-base-table'
import 'react-base-table/styles.css'
import BaseTableExpandIcon from 'react-base-table/ExpandIcon'

import ActionPanel from 'components/ActionPanel'
import ActionChannel, { createAction } from 'utils/actionChannel'

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

const Table = props => <BaseTable width={720} height={400} {...props} />
Table.Column = Column

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const EditorContainer = styled.div`
  flex: none;
  height: 300px;
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
  flex: none;
  min-height: 400px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f3f3;
  margin-bottom: 10px;
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

const LiveRunner = ({ name, code, scope = {}, ...rest }) => {
  const actionChannel = useMemo(() => new ActionChannel(name), [name])
  const action = useMemo(() => createAction(name), [name])

  return (
    <Container {...rest}>
      <LiveProvider
        code={code}
        scope={{
          React,
          ReactDOM,
          styled,
          css,
          keyframes,
          createGlobalStyle,
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

          Table,
          BaseTableRow,
          BaseTableExpandIcon,
          ...scope,
        }}
      >
        <PreviewContainer>
          <StyledPreview />
          <StyledError />
        </PreviewContainer>
        <ActionPanel name={name} channel={actionChannel} />
        <EditorContainer>
          <StyledEditor />
        </EditorContainer>
      </LiveProvider>
    </Container>
  )
}

export default LiveRunner
