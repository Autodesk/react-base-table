const columns = generateColumns(10)
const data = generateData(columns, 200)

const fixedColumns = columns.map((column, columnIndex) => {
  let frozen
  if (columnIndex < 2) frozen = Column.FrozenDirection.LEFT
  if (columnIndex > 8) frozen = Column.FrozenDirection.RIGHT
  return { ...column, frozen }
})

const expandColumnKey = 'column-1'

// add some sub items
data.forEach((rowData, rowIndex) => {
  const cellData = rowData[expandColumnKey]
  rowData[expandColumnKey] = `Group ${rowIndex}`
  for (let i = 0; i < 3; i++) {
    const subData = {
      ...rowData,
      id: `${rowData.id}-sub-${i}`,
      parentId: rowData.id,
      [expandColumnKey]: `Sub Group ${i}`,
    }
    data.push(subData)

    const subSubData = {
      ...subData,
      id: `${subData.id}-sub-sub-${i}`,
      parentId: subData.id,
      [expandColumnKey]: cellData,
    }
    data.push(subSubData)
  }
})

const treeData = unflatten(data)

const GroupCell = ({ cellData, rowData, column, className }) => {
  if (
    rowData.children &&
    rowData.children.length &&
    column.key !== expandColumnKey
  )
    return null
  return <div className={className}>{cellData}</div>
}

const components = {
  TableCell: GroupCell,
}

const rowStyle = ({ rowData }) =>
  rowData.children && rowData.children.length && { backgroundColor: '#f7f9fa' }

export default () => (
  <Table
    fixed
    columns={fixedColumns}
    data={treeData}
    rowStyle={rowStyle}
    expandColumnKey={expandColumnKey}
    onExpandedRowsChange={action('onExpandedRowsChange')}
    components={components}
  />
)
