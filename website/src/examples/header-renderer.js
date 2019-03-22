const columns = generateColumns(10)
const data = generateData(columns, 200)

const Row = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 15px;
`

const headerRenderer = ({ columns }) => <Row>This is a custom Header</Row>

export default () => (
  <Table fixed columns={columns} data={data} headerRenderer={headerRenderer} />
)
