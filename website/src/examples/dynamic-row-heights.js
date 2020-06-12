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

const frozenData = new Array(2).fill(0).map((row, rowIndex) => {
  return columns.reduce(
    (rowData, column, columnIndex) => {
      rowData[column.dataKey] = faker.random.words()
      return rowData
    },
    {
      id: `frozen-row-${rowIndex}`,
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

const expandColumnKey = 'column-0'

// add some sub items
for (let i = 0; i < 5; i++) {
  data.push({
    ...data[0],
    [columns[0].dataKey]: faker.random.words(),
    id: `${data[0].id}-sub-${i}`,
    parentId: data[0].id,
    [expandColumnKey]: `Sub ${i}`,
  })
  data.push({
    ...data[2],
    [columns[1].dataKey]: faker.random.words(),
    id: `${data[2].id}-sub-${i}`,
    parentId: data[2].id,
    [expandColumnKey]: `Sub ${i}`,
  })
  data.push({
    ...data[2],
    [columns[2].dataKey]: faker.random.words(),
    id: `${data[2].id}-sub-sub-${i}`,
    parentId: `${data[2].id}-sub-${i}`,
    [expandColumnKey]: `Sub-Sub ${i}`,
  })
}

const treeData = unflatten(data)

export default () => (
  <Table
    fixed
    columns={fixedColumns}
    data={treeData}
    frozenData={frozenData}
    estimatedRowHeight={60}
    expandColumnKey={expandColumnKey}
  />
)
