const columns = generateColumns(10)
const data = generateData(columns, 200)

export default () => <Table fixed columns={columns} data={data} />
