const columns = generateColumns(10)

const Empty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
`

export default () => (
  <Table
    columns={columns}
    data={[]}
    emptyRenderer={<Empty>Table is empty</Empty>}
  />
)
