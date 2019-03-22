const columns = generateColumns(10)
const data = generateData(columns, 200)

const fixedColumns = columns.map((column, columnIndex) => {
  let frozen
  if (columnIndex < 2) frozen = Column.FrozenDirection.LEFT
  if (columnIndex > 8) frozen = Column.FrozenDirection.RIGHT
  return { ...column, frozen }
})

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
`

export default () => (
  <Table
    fixed
    columns={columns}
    data={data}
    footerHeight={50}
    footerRenderer={<Footer>Custom Footer</Footer>}
  />
)
