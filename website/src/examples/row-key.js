const columns = generateColumns(10)
const data = generateData(columns, 200)

const fixedColumns = columns.map((column, columnIndex) => {
  let frozen
  if (columnIndex < 2) frozen = Column.FrozenDirection.LEFT
  if (columnIndex > 8) frozen = Column.FrozenDirection.RIGHT
  return { ...column, frozen }
})

const expandColumnKey = 'column-0'

// add some sub items
for (let i = 0; i < 3; i++) {
  data.push({
    ...data[0],
    ['column-0']: `${data[0]['column-0']}-sub-${i}`,
    parentId: data[0]['column-0'],
    [expandColumnKey]: `Sub ${i}`,
  })
  data.push({
    ...data[2],
    ['column-0']: `${data[2]['column-0']}-sub-${i}`,
    parentId: data[2]['column-0'],
    [expandColumnKey]: `Sub ${i}`,
  })
  data.push({
    ...data[2],
    ['column-0']: `${data[2]['column-0']}-sub-sub-${i}`,
    parentId: `${data[2]['column-0']}-sub-${i}`,
    [expandColumnKey]: `Sub-Sub ${i}`,
  })
}

const treeData = unflatten(data, null, 'column-0')

export default () => (
  <Table
    fixed
    rowKey="column-0"
    columns={fixedColumns}
    data={treeData}
    expandColumnKey={expandColumnKey}
    onRowExpand={action('onRowExpand')}
    onExpandedRowsChange={action('onExpandedRowsChange')}
  />
)
