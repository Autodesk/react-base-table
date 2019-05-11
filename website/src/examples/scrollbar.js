const columns = generateColumns(10)
const data = generateData(columns, 200)
const frozenData = generateData(columns, 3, 'frozen-row-')

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

const StyledTable = styled(Table)`
  .BaseTable__table .BaseTable__body {
    ::-webkit-scrollbar {
      -webkit-appearance: none;
      background-color: #e3e3e3;
    }

    ::-webkit-scrollbar:vertical {
      width: 10px;
    }

    ::-webkit-scrollbar:horizontal {
      height: 10px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      border: 2px solid #e3e3e3;
      background-color: #999;

      &:hover {
        background-color: #666;
      }
    }

    ::-webkit-resizer {
      display: none;
    }
  }
`

const Tip = styled.div`
  font-weight: 600;
`

const getScrollbarSize = () => 10

export default () => (
  <>
    <Tip>works only on WebKit based browser</Tip>
    <StyledTable
      fixed
      columns={fixedColumns}
      data={treeData}
      frozenData={frozenData}
      expandColumnKey={expandColumnKey}
      getScrollbarSize={getScrollbarSize}
    />
  </>
)
