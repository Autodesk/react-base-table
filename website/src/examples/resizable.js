const columns = generateColumns(10)
const data = generateData(columns, 200)
const frozenData = generateData(columns, 1, 'frozen-row-')

const fixedColumns = columns.map((column, columnIndex) => {
  let frozen
  if (columnIndex < 2) frozen = Column.FrozenDirection.LEFT
  if (columnIndex > 8) frozen = Column.FrozenDirection.RIGHT
  return { ...column, frozen, resizable: true, maxWidth: 300 }
})

const expandColumnKey = 'column-0'

// add some sub items
for (let i = 0; i < 3; i++) {
  data.push({
    ...data[0],
    id: `${data[0].id}-sub-${i}`,
    parentId: data[0].id,
    [expandColumnKey]: `Sub ${i}`,
  })
  data.push({
    ...data[2],
    id: `${data[2].id}-sub-${i}`,
    parentId: data[2].id,
    [expandColumnKey]: `Sub ${i}`,
  })
  data.push({
    ...data[2],
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
    expandColumnKey={expandColumnKey}
    onColumnResize={action('onColumnResize')}
    onColumnResizeEnd={action('onColumnResizeEnd')}
  />
)
