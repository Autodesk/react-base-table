const columns = generateColumns(10)
const data = generateData(columns, 200)

const fixedColumns = columns.map((column, columnIndex) => {
  let frozen
  if (columnIndex < 2) frozen = Column.FrozenDirection.LEFT
  if (columnIndex > 8) frozen = Column.FrozenDirection.RIGHT
  return { ...column, frozen }
})

const GlobalStyle = createGlobalStyle`
  .sticky-row.BaseTable__row {
    background-color: #f3f3f3;
  }
`

export default () => {
  const [stickyIndex, setStickyIndex] = React.useState(0)
  const tableData = data.slice(1)
  const frozenData = data.slice(stickyIndex, stickyIndex + 1)

  const rowClassName = React.useCallback(({ rowIndex }) => {
    // we sliced the original data by 1, so we have to correct the index back
    if (rowIndex < 0 || (rowIndex + 1) % 5 === 0) return 'sticky-row'
  })
  const handleScroll = React.useCallback(({ scrollTop }) => {
    setStickyIndex(Math.floor(scrollTop / 250) * 5)
  })
  return (
    <>
      <GlobalStyle />
      <Table
        fixed
        columns={fixedColumns}
        data={tableData}
        frozenData={frozenData}
        rowClassName={rowClassName}
        onScroll={handleScroll}
      />
    </>
  )
}
