const columns = generateColumns(15)
const data = generateData(columns, 200)

const GroupCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  &:not(:last-child) {
    border-right: 1px solid lightgray;
  }
`

const fixedColumns = columns.map((column, columnIndex) => {
  let frozen
  if (columnIndex < 3) frozen = Column.FrozenDirection.LEFT
  if (columnIndex > 12) frozen = Column.FrozenDirection.RIGHT
  return { ...column, frozen, width: 100 }
})

const headerRenderer = ({ cells, columns, headerIndex }) => {
  if (headerIndex === 2) return cells

  const groupCells = []
  let width = 0
  let idx = 0

  columns.forEach((column, columnIndex) => {
    // if there are frozen columns, there will be some placeholders for the frozen cells
    if (column[Table.PlaceholderKey]) groupCells.push(cells[columnIndex])
    else {
      width += cells[columnIndex].props.style.width
      idx++

      const nextColumn = columns[columnIndex + 1]
      if (
        columnIndex === columns.length - 1 ||
        nextColumn[Table.PlaceholderKey] ||
        idx === (headerIndex === 0 ? 4 : 2)
      ) {
        groupCells.push(
          <GroupCell
            key={`header-group-cell-${column.key}`}
            style={{ ...cells[columnIndex].props.style, width }}
          >
            Group width {width}
          </GroupCell>
        )
        width = 0
        idx = 0
      }
    }
  })
  return groupCells
}

export default () => (
  <Table
    fixed
    columns={fixedColumns}
    data={data}
    headerHeight={[30, 40, 50]}
    headerRenderer={headerRenderer}
  />
)
