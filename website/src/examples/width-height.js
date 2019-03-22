const columns = generateColumns(10)
const data = generateData(columns, 200)

export default () => (
  <Table columns={columns} data={data} width={400} height={300} />
)
