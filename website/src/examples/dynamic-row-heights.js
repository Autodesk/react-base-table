const columns = generateColumns(10)
const data = new Array(1000).fill(0).map((row, rowIndex) => {
  return columns.reduce(
    (rowData, column, columnIndex) => {
      rowData[column.dataKey] = faker.random.words()
      return rowData
    },
    {
      id: `row-${rowIndex}`,
      parentId: null,
    }
  )
})

const fixedColumns = columns.map((column, columnIndex) => {
  let frozen
  if (columnIndex < 2) frozen = Column.FrozenDirection.LEFT
  if (columnIndex > 8) frozen = Column.FrozenDirection.RIGHT
  return { ...column, frozen }
})

export default () => (
  <Table fixed columns={fixedColumns} data={data} estimatedRowHeight={60} />
)
