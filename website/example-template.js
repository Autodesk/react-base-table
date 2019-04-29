import React from 'react'
import moment from 'moment'
import styled, { css, keyframes, createGlobalStyle } from 'styled-components'

import BaseTable, {
  Column,
  SortOrder,
  AutoResizer,
  normalizeColumns,
  unflatten,
} from 'react-base-table'
import 'react-base-table/styles.css'

import { createAction } from 'utils/actionChannel'

const action = createAction(__filename)
const noop = () => {}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const Table = props => <BaseTable width={720} height={400} {...props} />
Table.Column = Column

const generateColumns = (count = 10, prefix = 'column-', props) =>
  new Array(count).fill(0).map((column, columnIndex) => ({
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
    ...props,
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

/*** placeholder ***/
