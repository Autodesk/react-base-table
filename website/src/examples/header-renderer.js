const columns = generateColumns(10)
const data = generateData(columns, 200)

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`

const CustomHeader = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 0 7.5px;
`

columns[0].frozen = Column.FrozenDirection.LEFT
columns[1].frozen = Column.FrozenDirection.LEFT
columns[2].frozen = Column.FrozenDirection.RIGHT

const headerRenderer = ({ cells, columns }) => {
  // frozen table's header
  if (columns.every(x => x.frozen)) return cells

  // scrollalbe table's header, as there are placeholders for the frozen cells
  // we have to keep them to make sure the custom content display in the right palce
  const leftPlaceholders = []
  const rightPlaceholders = []
  columns.forEach((column, idx) => {
    if (column.frozen === Column.FrozenDirection.RIGHT)
      rightPlaceholders.push(cells[idx])
    else if (column.frozen) leftPlaceholders.push(cells[idx])
  })

  return (
    <Row>
      {leftPlaceholders}
      <CustomHeader>This is a custom Header</CustomHeader>
      {rightPlaceholders}
    </Row>
  )
}

export default () => (
  <Table fixed columns={columns} data={data} headerRenderer={headerRenderer} />
)
