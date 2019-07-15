const columns = generateColumns(10, undefined, { resizable: true })
const data = generateData(columns, 200)

const colSpanIndex = 1
columns[colSpanIndex].colSpan = ({ rowData, rowIndex }) => (rowIndex % 4) + 1
columns[colSpanIndex].align = Column.Alignment.CENTER

const rowSpanIndex = 0
columns[rowSpanIndex].rowSpan = ({ rowData, rowIndex }) =>
  rowIndex % 2 === 0 && rowIndex <= data.length - 2 ? 2 : 1

const rowRenderer = ({ rowData, rowIndex, cells, columns }) => {
  const colSpan = columns[colSpanIndex].colSpan({ rowData, rowIndex })
  if (colSpan > 1) {
    let width = cells[colSpanIndex].props.style.width
    for (let i = 1; i < colSpan; i++) {
      width += cells[colSpanIndex + i].props.style.width
      cells[colSpanIndex + i] = null
    }
    const style = {
      ...cells[colSpanIndex].props.style,
      width,
      backgroundColor: 'lightgray',
    }
    cells[colSpanIndex] = React.cloneElement(cells[colSpanIndex], { style })
  }

  const rowSpan = columns[rowSpanIndex].rowSpan({ rowData, rowIndex })
  if (rowSpan > 1) {
    const cell = cells[rowSpanIndex]
    const style = {
      ...cell.props.style,
      backgroundColor: 'darkgray',
      height: rowSpan * 50 - 1,
      alignSelf: 'flex-start',
      zIndex: 1,
    }
    cells[rowSpanIndex] = React.cloneElement(cell, { style })
  }
  return cells
}

export default () => (
  <Table
    fixed
    columns={columns}
    data={data}
    rowRenderer={rowRenderer}
    overscanRowCount={2}
  />
)
