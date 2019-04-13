const columns = generateColumns(10)
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

columns[0].frozen = Column.FrozenDirection.LEFT
columns[1].frozen = Column.FrozenDirection.LEFT
columns[2].frozen = Column.FrozenDirection.RIGHT

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
        idx === 3 - headerIndex
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
    columns={columns}
    data={data}
    headerHeight={[30, 40, 50]}
    headerRenderer={headerRenderer}
  />
)
