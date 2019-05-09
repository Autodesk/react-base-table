const columns = generateColumns(10)
const data = generateData(columns, 200)

const fixedColumns = columns.map((column, columnIndex) => {
  let frozen
  if (columnIndex < 2) frozen = Column.FrozenDirection.LEFT
  if (columnIndex > 8) frozen = Column.FrozenDirection.RIGHT
  return { ...column, frozen }
})

fixedColumns[0].format = 'checkbox'
fixedColumns[1].format = 'contact'

const Contact = styled.div`
  font-weight: 700;
  color: orange;
`

const stringRenderer = ({ className, cellData }) => (
  <div className={className}>{cellData}</div>
)
const checkboxRenderer = ({ rowIndex }) => (
  <input type="checkbox" checked={rowIndex % 2 === 0} />
)
const contactRenderer = ({ cellData }) => <Contact>{cellData}</Contact>

const renderers = {
  string: stringRenderer,
  checkbox: checkboxRenderer,
  contact: contactRenderer,
}

const Cell = cellProps => {
  const format = cellProps.column.format || 'string'
  const renderer = renderers[format] || renderers.string

  return renderer(cellProps)
}

const components = {
  TableCell: Cell,
}

const expandColumnKey = 'column-1'
const treeData = unflatten(data)

export default () => (
  <Table
    fixed
    columns={fixedColumns}
    data={treeData}
    expandColumnKey={expandColumnKey}
    onExpandedRowsChange={action('onExpandedRowsChange')}
    components={components}
  />
)
