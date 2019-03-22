const columns = generateColumns(10)
const data = generateData(columns, 200)

const Row = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 15px;
`

const headerRenderer = ({ cells, columns, headerIndex }) => {
  if (headerIndex === 0) return <Row>This is a custom Header</Row>
  if (headerIndex === 1) return cells.slice(0, 5)
  return cells
}

export default () => (
  <Table
    columns={columns}
    data={data}
    headerHeight={[30, 40, 50]}
    headerRenderer={headerRenderer}
  />
)
