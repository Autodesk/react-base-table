const columns = generateColumns(10)
const data = generateData(columns, 200)
const tableRef = React.createRef()

const GlobalStyle = createGlobalStyle`
  .BaseTable.active-col-0 [data-col-idx="0"],
  .BaseTable.active-col-1 [data-col-idx="1"],
  .BaseTable.active-col-2 [data-col-idx="2"],
  .BaseTable.active-col-3 [data-col-idx="3"],
  .BaseTable.active-col-4 [data-col-idx="4"],
  .BaseTable.active-col-5 [data-col-idx="5"],
  .BaseTable.active-col-6 [data-col-idx="6"],
  .BaseTable.active-col-7 [data-col-idx="7"],
  .BaseTable.active-col-8 [data-col-idx="8"],
  .BaseTable.active-col-9 [data-col-idx="9"] {
    background: #f3f3f3;
  }
`

const cellProps = ({ columnIndex }) => ({
  'data-col-idx': columnIndex,
  onMouseEnter: () => {
    const table = tableRef.current.getDOMNode()
    table.classList.add(`active-col-${columnIndex}`)
  },
  onMouseLeave: () => {
    const table = tableRef.current.getDOMNode()
    table.classList.remove(`active-col-${columnIndex}`)
  },
})

const headerCellProps = ({ columnIndex }) => ({
  'data-col-idx': columnIndex,
})

export default () => (
  <>
    <GlobalStyle />
    <Table
      ref={tableRef}
      columns={columns}
      data={data}
      cellProps={cellProps}
      headerCellProps={headerCellProps}
    />
  </>
)
