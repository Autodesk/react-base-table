const columns = generateColumns(10)
const data = generateData(columns, 200)
const frozenData = generateData(columns, 1, 'frozen-row-')

const fixedColumns = columns.map((column, columnIndex) => {
  let frozen
  if (columnIndex < 2) frozen = Column.FrozenDirection.LEFT
  if (columnIndex > 8) frozen = Column.FrozenDirection.RIGHT
  return { ...column, frozen }
})

const rowEventHandlers = {
  onClick: action('click'),
  onDoubleClick: action('double click'),
  onContextMenu: action('context menu'),
  onMouseEnter: action('mouse enter'),
  onMouseLeave: action('mouse leave'),
}

export default () => (
  <Table
    fixed
    columns={fixedColumns}
    data={data}
    frozenData={frozenData}
    rowEventHandlers={rowEventHandlers}
  />
)
