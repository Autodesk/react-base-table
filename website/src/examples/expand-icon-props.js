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

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const Loader = styled.div`
  display: inline-block;
  border-radius: 100%;
  margin: 2px;
  border: 2px solid #0696d7;
  border-bottom-color: transparent;
  margin: 2px;
  width: 12px;
  height: 12px;
  animation: ${rotate} 0.75s linear infinite;
  margin-left: ${props => props.depth * 16}px;
`

const ExpandIcon = ({ expanding, ...rest }) =>
  expanding ? <Loader depth={rest.depth} /> : <BaseTableExpandIcon {...rest} />

const components = {
  ExpandIcon,
}

const expandIconProps = ({ rowData }) => ({
  expanding: !rowData.children || rowData.children.length === 0,
})

export default () => (
  <Table
    fixed
    columns={fixedColumns}
    data={treeData}
    expandColumnKey={expandColumnKey}
    defaultExpandedRowKeys={['row-0']}
    onRowExpand={action('onRowExpand')}
    onExpandedRowsChange={action('onExpandedRowsChange')}
    expandIconProps={expandIconProps}
    components={components}
  />
)
