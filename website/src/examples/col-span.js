const columns = generateColumns(10, undefined, { resizable: true })
const data = generateData(columns, 200)

const spanIndex = 1
columns[spanIndex].colSpan = ({ rowData, rowIndex }) => (rowIndex % 4) + 1
columns[spanIndex].align = Column.Alignment.CENTER

const rowRenderer = ({ rowData, rowIndex, cells, columns }) => {
  const span = columns[spanIndex].colSpan({ rowData, rowIndex })
  if (span > 1) {
    let width = cells[spanIndex].props.style.width
    for (let i = 1; i < span; i++) {
      width += cells[spanIndex + i].props.style.width
      cells[spanIndex + i] = null
    }
    const style = {
      ...cells[spanIndex].props.style,
      width,
      backgroundColor: 'lightgray',
    }
    cells[spanIndex] = React.cloneElement(cells[spanIndex], { style })
  }
  return cells
}

export default () => (
  <Table fixed columns={columns} data={data} rowRenderer={rowRenderer} />
)
